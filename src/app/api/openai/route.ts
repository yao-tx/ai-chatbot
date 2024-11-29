import { openai } from "@/lib/openai";
import { RateLimitError } from "openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
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
        }
      }
    )
  } catch (error) {
    if (error instanceof RateLimitError) {
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded" }),
        { status: 429 }
      );
    }

    return new NextResponse(JSON.stringify(
      { error: "Something went wrong" }),
      { status: 500 }
    );
  }
}
