import GoogleButton from "@/components/login/GoogleButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { signIn } from "@/auth";

export default function Login() {
  const handleGoogleSignIn = async () => {
    "use server";
    await signIn("google");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <main className="max-w-lg w-full">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">AI Chatbot</CardTitle>
            <CardDescription>
              Welcome, please sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleButton handleGoogleSignIn={handleGoogleSignIn} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}