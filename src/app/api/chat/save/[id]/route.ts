import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { message } = await req.json();

  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "unauthorized user" }, { status: 401 });
  }

  const { data: chatSession, error: chatSessionError } = await supabase
    .from("chat_sessions")
    .select("id")
    .eq("id", id)
    .eq("user_id", session.user.id)
    .single();

  if (chatSessionError || !chatSession) {
    return NextResponse.json({ error: "unauthorized user" }, { status: 401 });
  }

  const { error } = await supabase
    .from("chat_messages")
    .insert({
      chat_session_id: chatSession.id,
      role: message.role,
      message: message.message,
    });

  if (error ) {
    return NextResponse.json(
      { error: "unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
