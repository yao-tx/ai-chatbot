import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "unauthorized user" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .select(`
      id,
      created_at,
      chat_messages!inner (
        id,
        role,
        message
      )
    `)
    .eq("user_id", session.user.id)
    .order("id", { ascending: false })
    .limit(1, { foreignTable: "chat_messages" });

  if (error || !data) {
    return NextResponse.json({ error: "unexpected error encountered, please try again later" }, { status: 500 });
  }

  const chatHistory = data.map((chatSession) => {
    return {
      id: chatSession.id,
      oldest_message: {
        id: chatSession.chat_messages[0].id,
        role: chatSession.chat_messages[0].role,
        message: chatSession.chat_messages[0].message,
      },
    };
  });

  return NextResponse.json({ chat_history: chatHistory }, { status: 200 });
}
