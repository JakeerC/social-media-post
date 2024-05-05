import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./AuthButton.server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data: tweets } = await supabase.from("tweets").select();

  if (!session) {
    redirect("/login");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <AuthButtonServer />
      <pre className="">{JSON.stringify(tweets, null, 2)}</pre>
    </main>
  );
}
