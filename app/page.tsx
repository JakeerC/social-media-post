import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NewTweet from "../components/NewTweet";
import Tweets from "../components/Tweets";
import LogOut from "../components/Logout";

export const dynamic = "force-dynamic";
export default async function Home() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/login");
  }
  const { data } = await supabase
    .from("tweets")
    .select("*, author:profiles(*), likes(user_id)")
    .order("created_at", { ascending: false });

  const tweets =
    data?.map((tweet) => ({
      ...tweet,
      author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
      user_has_likes_tweet: !!tweet.likes.find(
        (like) => like.user_id === session.user.id
      ),

      likes: tweet.likes.length,
    })) ?? [];
  return (
    <main className="w-full max-w-xl mx-auto">
      <div className="flex justify-between px-4 py-6 border-b  border-gray-800">
        <h1 className="text-xl font-bold">Home</h1>
        <LogOut />
      </div>
      <NewTweet user={session.user} />
      <Tweets tweets={tweets} />
      {/* <pre className="">{JSON.stringify(tweets, null, 2)}</pre> */}
    </main>
  );
}
