"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AuthButton() {
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: "/auth/callback" },
    });
  };

  return (
    <>
      <button onClick={handleSignIn}>LogIn</button>
      <button onClick={handleSignOut}>LogOut</button>
    </>
  );
}
