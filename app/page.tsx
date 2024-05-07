import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./AuthButton.server";
import { redirect } from "next/navigation";
import { profile } from "console";
import NewTweet from "./NewTweet";
import Like from "./Like";
import Tweets from "./Tweets";

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
    .select("*, author:profiles(*), likes(user_id)");

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
    <main className="flex min-h-screen flex-col items-center  p-12">
      <AuthButtonServer />
      <NewTweet />
      <Tweets tweets={tweets} />
      {/* <pre className="">{JSON.stringify(tweets, null, 2)}</pre> */}
    </main>
  );
}
