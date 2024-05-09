"use client";

import { useEffect, useOptimistic } from "react";
import Like from "./Like";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {
  const [optimisticTweets, addOptimisticTweet] = useOptimistic<
    TweetWithAuthor[],
    TweetWithAuthor
  >(tweets, (currentOptimisticTweets, newTweet) => {
    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(
      (tweet) => tweet.id === newTweet.id
    );
    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  });
  const router = useRouter();

  useEffect(() => {
    const channel = supabaseClient
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return optimisticTweets.map((tweet) => (
    <div
      key={tweet.id}
      className="border border-gray-800 border-t-0 px-4 py-4 flex flex-col justify-between m-0 "
    >
      <div className="flex flex-[0.8] min-h-16">
        <div className="bg-gray-200 h-8 w-8 rounded-full">
          <Image
            src={tweet.author.avatar_url.replaceAll('"', "")}
            alt="user avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <div className="ml-4 flex-1">
          <p className="">
            <span>{tweet.author.name.replaceAll('"', "")}</span>
            <span className="text-gray-400 ml-4 text-sm">
              @{tweet.author.username.replaceAll('"', "")}
            </span>
          </p>
          <p className="text-gray-300 text-sm">{tweet?.title}</p>
        </div>
      </div>
      <div className="flex flex-[0.2] pl-12">
        <Like tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
      </div>
    </div>
  ));
}
