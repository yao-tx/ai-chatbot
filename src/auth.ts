import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .limit(1)
        .single();

      if (!error && data?.id) {
        return { ...session, user: { ...session.user, id: data.id } };
      }

      const { data: insertData, error: insertError } = await supabase
        .from("users")
        .insert({ email: session.user.email, name: session.user.name })
        .select("id")
        .single();

      if (insertError) {
        throw new Error("failed to add user");
      }

      if (!insertData?.id) {
        throw new Error("failed to add user");
      }

      return { ...session, user: { ...session.user, id: insertData.id } };
    },
  },
  pages: {
    signIn: "/login",
  },
});