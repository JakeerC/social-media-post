import { Database as DB } from "./lib/database.types";
import { type User as AuthUser } from "@supabase/auth-helpers-nextjs";
declare global {
  type Database = DB;

  type Tweet = DB["public"]["Tables"]["tweets"]["Row"];
  type Profile = DB["public"]["Tables"]["profiles"]["Row"];
  type User = AuthUser;
  type TweetWithAuthor = Tweet & {
    author: Profile;
    likes: number;
    user_has_likes_tweet: boolean;
  };
}
