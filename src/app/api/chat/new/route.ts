import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  const { prompt } = await req.json();

  if (!session || !session.user) {
    return NextResponse.json({ error: "unauthorized user" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({
      user_id: session.user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }

  const { error: messageError } = await supabase
    .from("chat_messages")
    .insert({
      chat_session_id: data.id,
      role: "user",
      message: prompt,
    });

  if (messageError) {
    return NextResponse.json(
      { error: "unexpected error occurred, please try again later" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(new URL(`/chat/${data.id}`, req.url));
}
