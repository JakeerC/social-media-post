import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonClient from "./AuthButton.client";

export default async function AuthButtonServer() {
  const supabase = createServerComponentClient<Database>({ cookies: cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <AuthButtonClient session={session} />;
}
