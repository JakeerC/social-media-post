import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default function NewTweet() {
  const addTweet = async (formData: FormData) => {
    "use server";
    const title = String(formData.get("title"));
    const supabase = createServerActionClient<Database>({ cookies: cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("tweets").insert({ title: title, user_id: user.id });
      revalidatePath("/");
    }
  };
  return (
    <form action={addTweet}>
      <input
        name="title"
        type="text"
        className="bg-inherit border-gray-200 border min-w-[40ch] min-h-[10ch] bg-slate-300 rounded-md "
      />
    </form>
  );
}
