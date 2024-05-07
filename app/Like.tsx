"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

//@ts-ignore
export default function Like({ tweet }) {
  const router = useRouter();
  const toggleLike = async () => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      if (tweet.user_has_likes_tweet) {
        await supabase.from("likes").delete().match({
          user_id: user.id,
          tweet_id: tweet?.id,
        });
        router.refresh(); //dont refresh , as it re-paints entire page
      } else {
        await supabase
          .from("likes")
          .insert({ user_id: user.id, tweet_id: tweet?.id });
        router.refresh(); //dont refresh , as it re-paints entire page
      }
    }
  };

  return (
    <button className="flex gap-2" onClick={toggleLike}>
      <span className="w-8">{tweet?.likes} </span>
      <LikeIcon liked={tweet.user_has_likes_tweet} /> <span>Like</span>
    </button>
  );
}

const LikeIcon = ({ liked }: { liked: boolean }) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 48 48"
    version="1"
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 48 48"
  >
    <path
      fill={liked ? "#F44336" : "none"}
      stroke={"#F44336"}
      strokeWidth={4}
      d="M34,9c-4.2,0-7.9,2.1-10,5.4C21.9,11.1,18.2,9,14,9C7.4,9,2,14.4,2,21c0,11.9,22,24,22,24s22-12,22-24 C46,14.4,40.6,9,34,9z"
    />
  </svg>
);
