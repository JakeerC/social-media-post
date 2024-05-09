"use client";

import { supabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Like({
  tweet,
  addOptimisticTweet,
}: {
  tweet: TweetWithAuthor;
  addOptimisticTweet: (tweet: TweetWithAuthor) => void;
}) {
  const router = useRouter();
  const toggleLike = async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (user) {
      if (tweet.user_has_likes_tweet) {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes - 1,
          user_has_likes_tweet: !tweet.user_has_likes_tweet,
        });
        await supabaseClient.from("likes").delete().match({
          user_id: user.id,
          tweet_id: tweet?.id,
        });
        router.refresh(); //dont refresh , as it re-paints entire page
      } else {
        addOptimisticTweet({
          ...tweet,
          likes: tweet.likes + 1,
          user_has_likes_tweet: !tweet.user_has_likes_tweet,
        });
        await supabaseClient
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet.id });
        router.refresh(); //dont refresh , as it re-paints entire page
      }
    }
  };

  return (
    <button
      className="flex gap-2 items-center text-xs my-2"
      onClick={toggleLike}
    >
      <LikeIcon liked={tweet.user_has_likes_tweet} />{" "}
      <span className="">{tweet.likes} </span>
    </button>
  );
}

const LikeIcon = ({ liked }: { liked: boolean }) => (
  <svg
    width="16px"
    height="16px"
    viewBox="0 0 48 48"
    version="1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill={liked ? "#F44336" : "none"}
      stroke={liked ? "#F44336" : "#eee"}
      strokeWidth={3}
      d="M34,9c-4.2,0-7.9,2.1-10,5.4C21.9,11.1,18.2,9,14,9C7.4,9,2,14.4,2,21c0,11.9,22,24,22,24s22-12,22-24 C46,14.4,40.6,9,34,9z"
    />
  </svg>
);
