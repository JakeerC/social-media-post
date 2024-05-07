"use client";

import { useOptimistic } from "react";
import Like from "./Like";

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
  return optimisticTweets.map((tweet) => (
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
      <Like tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
    </div>
  ));
}
