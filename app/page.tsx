import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButton from "./AuthButton";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const { data: tweets } = await supabase.from("tweets").select();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AuthButton />
      <pre className="">{JSON.stringify(tweets, null, 2)}</pre>
    </main>
  );
}
