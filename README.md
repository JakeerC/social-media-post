# Blue Bird

## Step 1:

Create a new nextjs app

```bash
npx create-next-app blue bird
```

Cleanup initial code

```bash
npm i @supabase/auth-helpers-nextjs  @supabase/supabase-js
```

## Step 2:

1. ⚡️ Create a new supabase account

2. ⚡️ Create a new project ( `blue bird`)

3. ⚡️ Create a new table `tweets` (for properties refer `database.types.ts` types)

4. Connect to database by providing database url , anon (refer `.env.example`)

5. Get tweets from database

> [!NOTE]
> Initially we get `[ ]` empty data as `RLS ( Row Level Security)` in applied on `tweets` table

6. ⚡️ Create a policy to expose data to users/public

7. Create oAuth using github from settings/developer-settings/oauth in github

8. ⚡️ Enable github oauth provider in supabase

9. Implement github oauth provider using supabase methods

10. Save session to cookies using middleware.ts

```ts
// `middleware.ts` at root level

import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();

  return res;
}
```

11. Redirect to Login page if session is expired or session not found or not authenticated

12. Implement Authentication using login and protected routes by redirecting to login

13. refresh/refetch data on login/logout by `router.refresh()` on logout

> [!NOTE]
>
> `router` is return through `@next/navigation`'s `useRouter`

### Generate Supabase database types

You can generate types of supabase table using cli

```bash
npx supabase login
```

Create `lib` folder

```bash
npx supabase gen types typescript --project-id project-id-from-supabase > lib/database.types.ts
```

expose `lib/database.types.ts` globally from `global.d.ts`

> [!IMPORTANT]
>
> Update types by running below command every type you modify( add columns , change type or null checks) tables in supabase
>
> ```bash
> npx supabase gen types typescript --project-id project-id-from-supabase > lib/database.types.ts
> ```

## Step 3: Create Foreign key and profiles table

> [!NOTE]
> All login user information in stored in `user` tables of `auth` type automatically
> whereas `tweets` table is public type

- [ ] ⚡️ Create a foreign-key `user_id` column for `tweets`
- [ ] ⚡️ Link it with `id` column of `users` table of `auth` type
- [ ] ⚡️ `cascade` the column
- [ ] ⚡️ Make it `not null`

> [!CAUTION]
> It may give error when creating foreign key as not null as existing record don't have that value , add `user_id` to existing records and edit column to make it `not null`

Now every tweet is linked to a user

If you see we still don't have a user friendly data of users and `users` table private data , we cant use this directly.

So, we create a new table `profiles` table

### ⚡️ Create `profiles` table

- [ ] ⚡️ With foreign key `id` as primary key and links to `id` of `users` table of `auth` type
- [ ] ⚡️ Add `name`, `username` and `avatar_url` columns to `profiles` as `text` and `not null`

Now we have to insert user data to `profiles` table every time a new user is created

### Insert user to `profiles` table

1. [ ] ⚡️ Create a new function

   - give a name
   - add definition
   - in adv settings > security definer

   ```pgsql
   create function public.create_profile_for_user()
   returns trigger
   language plpgsql
   security definer set search_path = public
   as $$
   begin
   insert into public.profiles (id, name, username, avatar_url)
   values (
    new.id,
    new.raw_user_meta_data->'name',
    new.raw_user_meta_data->'user_name',
    new.raw_user_meta_data->'avatar_url'
   );
   return new;
   end;
   $$;

   ```

2. [ ] ⚡️ Create a new trigger

   - [Youtube video](https://www.youtube.com/watch?v=mcrqn77lUmM&ab_channel=DailyWebCoding)

   ```sql
   create trigger on_auth_user_created
   after insert on auth.users
   for each row execute procedure public.create_profile_for_user();
   ```

> [!NOTE]
>
> Don't forget to change `tweets` table `user_id` foreign key from `auth.users.id` to `profiles.id`

## Step 4: Create tweet

**Only authenticated users can create tweet**

- [ ] ⚡️ Create a new policy for tweets table to insert tweet for authenticated user

- [ ] Add a new tweet form component with input and form action

```ts
// form action
const addTweet = async (formData: FormData) => {
  "use server";
  const title = String(formData.get("title"));
  const supabase = createServerActionClient<Database>({ cookies: cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("tweets").insert({ title: title, user_id: user.id });
    revalidatePath("/"); // refetch the data from db after insert
  }
};
```

## Step 5: Like tweet

- [ ] ⚡️ Create a new table `likes` with the following columns
- ⚡️ Columns: id(primary key), create_at (time stamp), tweet_id (foreign key links to `tweets`'s id), user_id (foreign key links to `prifiles`'s id)
- ⚡️ create new policies for likes

  1.  [ ] Any one can read likes (public)(Select)
  2.  [ ] Authenticated users can insert like (Insert)
  3.  [ ] Authenticated users can delete like (Delete)

> [!TIP] Run Supabase cli comman to update database types

### Add Like button

- Create a new component `Like` to display and add likes (client component)

- Get likes data by following code , as `likes` is linked to `tweets` table

```ts
const supabase = createServerComponentClient<Database>({ cookies });
const { data } = await supabase
  .from("tweets")
  .select("*, profiles(*), likes(*)");
```

- Read no of likes as length of like property from data/tweets.

  > [!TIP] refer datatype of likes from `database` types for more clarification)

- To Insert likes add following like button handler

  ```ts
  const toggleLike = async () => {
    const supabase = createClientComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from("likes")
        .insert({ user_id: user.id, tweet_id: tweet.id });
    }
    ddd;
    // `tweet` is coming as prop from page which data property
  };
  ```

  currently user can add as many likes as he can but can't unlike

### Like & Unlike

- Add an extra property on tweets data `user_has_liked_tweet`

```ts {4,5,6}
const tweets =
  data?.map((tweet) => ({
    ...tweet,
    user_has_likes_tweet: !!tweet.likes.find(
      (like) => like.user_id === session.user.id
    ),
    likes: tweet.likes.length,
  })) ?? [];
```

- Modify like button handler to toggle `insert` and `delete` record based on `user_has_liked_tweet` property

```ts
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
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: user.id, tweet_id: tweet?.id });
    }
  }
};
```

### Declare Global Intersection Types for Transformed Supabase Data with Typescript

> [!TIP]
>
> We can rename properties from select, for example
>
> ```ts
> const { data } = await supabase
>   .from("tweets")
>   .select("*, author:profiles(*), likes(user_id)");
>
> // we can access profiles property from author
> ```

Create an intersection type for Like props

```ts
type Tweet = Database["public"]["Tables"]["tweets"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type TweetWithAuthor = Tweet & {
  author: Profile;
  likes: number;
  user_has_likes_tweet: boolean;
};
```

Now page file may contain type errors , resolve this by [!editing](#Like & Unlike)

```ts {4,5,6}
const tweets =
  data?.map((tweet) => ({
    ...tweet,
    author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
    user_has_likes_tweet: !!tweet.likes.find(
      (like) => like.user_id === session.user.id
    ),
    likes: tweet.likes.length,
  })) ?? [];
```
