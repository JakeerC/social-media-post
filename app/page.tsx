import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import AuthButtonServer from "./AuthButton.server";
import { redirect } from "next/navigation";
import { profile } from "console";
import NewTweet from "./NewTweet";
import Like from "./Like";

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
      {tweets?.map((tweet) => (
        <div
          key={tweet.id}
          className="m-2 bg-gray-300 border border-slate-500 rounded-md min-w-[40ch]"
        >
          <p className="flex flex-col ">
            {tweet.author.name.replaceAll('"', "")}
            <span className="text-gray-500">
              @{tweet.author.username.replaceAll('"', "")}
            </span>
          </p>
          <p>{tweet?.title}</p>
          <hr />
          <Like tweet={tweet} />
        </div>
      ))}
      <pre className="">{JSON.stringify(tweets, null, 2)}</pre>
    </main>
  );
}
