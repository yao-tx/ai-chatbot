import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ error: "unauthorized user" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_sessions")
    .select(`
      id,
      chat_messages (id, role, message).order(id, asc)
    `)
    .eq("user_id", session.user.id)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: `failed to load chat ${id}` },
      { status: 400 }
    );
  }

  return NextResponse.json({ chat_session: data }, { status: 200 });
}
