import { Database as DB } from "./lib/database.types";

declare global {
  type Database = DB;

  type Tweet = DB["public"]["Tables"]["tweets"]["Row"];
  type Profile = DB["public"]["Tables"]["profiles"]["Row"];
  type TweetWithAuthor = Tweet & {
    author: Profile;
    likes: number;
    user_has_likes_tweet: boolean;
  };
}
