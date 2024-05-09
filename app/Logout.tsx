"use client";

import { supabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LogOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    router.refresh();
  };

  return (
    <button className={"text-xs text-gray-400"} onClick={handleSignOut}>
      LogOut
    </button>
  );
}
