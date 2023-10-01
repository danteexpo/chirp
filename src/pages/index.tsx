import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";

import { type RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full items-center gap-6">
      <Image
        src={user.profileImageUrl}
        alt={`@${user.username}'s profile image` ?? "Profile image"}
        height={48}
        width={48}
        className="rounded-full"
      />
      <input
        type="text"
        placeholder="Type emojis!"
        className="grow border border-slate-400 bg-transparent p-3 outline-none"
      />
      <span className="border border-slate-400 p-3">
        <SignOutButton />
      </span>
    </div>
  );
};

type PostWithAuthor = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithAuthor) => {
  const { post, author } = props;

  return (
    <div className="flex items-center gap-6 border-b border-b-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}'s profile image` ?? "Profile image"}
        height={48}
        width={48}
        className="rounded-full"
      />
      <span className="flex flex-col">
        <span className="flex gap-1">
          <p className="font-bold">@{author.username}</p>
          <p className="font-light text-slate-400">
            ~ {dayjs(post.createdAt).fromNow()}
          </p>
        </span>
        <p className="text-md">{post?.content}</p>
      </span>
    </div>
  );
};

export default function Home() {
  const { data, isLoading } = api.posts.getAll.useQuery();

  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full md:max-w-2xl md:border-x md:border-x-slate-400">
          {isLoading ? (
            <p className="p-4">Loading...</p>
          ) : !data ? (
            <p className="p-4">Something went wrong</p>
          ) : (
            <>
              <div className="flex border-b border-b-slate-400 p-4">
                {!isSignedIn && <SignInButton />}
                {isSignedIn && CreatePostWizard()}
              </div>
              <div className="flex flex-col">
                {data.map((postWithAuthor) => (
                  <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
