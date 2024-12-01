import { NextRequest, NextResponse } from "next/server";

import { openai } from "@/lib/openai";
import { RateLimitError } from "openai";

import type { ChatMessage } from "@/app/types/chat";

const OPENAI_MODEL = "gpt-3.5-turbo";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const promptMessage = {
      role: "system",
      content: "You are AI Chatbot, a helpful assistant that can answer questions and help with tasks.",
    };

    const messagesToSend = messages.map((message: ChatMessage) => ({
      role: message.role,
      content: message.message,
    }));

    const stream = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [promptMessage, ...messagesToSend],
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();

    return new NextResponse(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/plain",
          "Transfer-Encoding": "chunked",
        },
      }
    );
  } catch (error) {
    if (error instanceof RateLimitError) {
      return new NextResponse(
        JSON.stringify({ error: "rate limit exceeded, please check your OpenAI credits" }),
        { status: 429 }
      );
    }

    return new NextResponse(JSON.stringify({ error: "unexpected error occurred, please try again later" }), {
      status: 500,
    });
  }
}
