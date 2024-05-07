"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type LikePropsType = {
  tweet: {
    created_at: string;
    id: string;
    title: string;
    user_id: string;
    profiles: {
      avatar_url: string;
      id: string;
      name: string;
      username: string;
    } | null;
    likes: {
      created_at: string;
      id: number;
      tweet_id: string;
      user_id: string;
    }[];
  };
};
export default function Like({ tweet }: LikePropsType) {
  const router = useRouter();
  const toggleLike = async () => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("likes")
        .insert({ user_id: user.id, tweet_id: tweet.id });
      router.refresh(); //dont refresh , as it re-paints entire page
    }
  };

  return (
    <button className="flex gap-2" onClick={toggleLike}>
      <span>{tweet?.likes?.length} </span>
      <LikeIcon /> <span>Like</span>
    </button>
  );
}

const LikeIcon = ({}) => (
  <svg
    width="24px"
    height="24px"
    viewBox="0 0 48 48"
    version="1"
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 48 48"
  >
    <path
      fill="#F44336"
      d="M34,9c-4.2,0-7.9,2.1-10,5.4C21.9,11.1,18.2,9,14,9C7.4,9,2,14.4,2,21c0,11.9,22,24,22,24s22-12,22-24 C46,14.4,40.6,9,34,9z"
    />
  </svg>
);
