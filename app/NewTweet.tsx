import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Image from "next/image";
import TweetForm from "./TweetForm";

export const dynamic = "force-dynamic";
export default function NewTweet({ user }: { user: User }) {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));

    if (title) {
      const supabase = createServerActionClient<Database>({ cookies: cookies });
      await supabase.from("tweets").insert({ title: title, user_id: user.id });
      revalidatePath("/");
    }
  };
  return <TweetForm addTweet={addTweet} user={user} />;
}
