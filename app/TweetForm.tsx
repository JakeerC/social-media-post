"use client";

import { User } from "@supabase/supabase-js";
import Image from "next/image";
import { useRef, useState } from "react";

export default function TweetForm({
  addTweet,
  user,
}: {
  addTweet: (formData: FormData) => Promise<void>;
  user: User;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [text, setText] = useState<string>("");

  return (
    <form
      className={"border border-gray-800  border-t-0   flex flex-col"}
      ref={ref}
      action={async (formData) => {
        await addTweet(formData);
        ref.current?.reset();
      }}
    >
      <div className="flex m-4">
        <div className="bg-gray-200 h-12 w-12 rounded-full">
          <Image
            src={user.user_metadata.avatar_url}
            alt="user avatar"
            width={48}
            height={48}
          />
        </div>
        <textarea
          onChange={(e) => setText(e.target.value)}
          name="title"
          maxLength={255}
          placeholder="What is happening..."
          className="resize-none h-[10ch] bg-gray-800/50 rounded-lg focus-visible:none outline-none  flex-1 ml-2 px-2 leading-loose placeholder-gray-500 "
        />
      </div>
      <button
        disabled={!text}
        type="submit"
        className="bg-blue-400 text-white px-4 py-1 mr-4 mb-4 rounded-full self-end disabled:bg-blue-200 disabled:text-gray-900 disabled:cursor-not-allowed "
      >
        Post
      </button>
    </form>
  );
}
