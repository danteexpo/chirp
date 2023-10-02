import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { type RouterOutputs, api } from "~/utils/api";
import relativeTime from "dayjs/plugin/relativeTime";
import LoadingSpinner from "~/components/LoadingSpinner";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import Link from "next/link";
import PageLayout from "~/components/PageLayout";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
      toast.success("New post added successfully!");
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;

      if (errorMessage?.[0]) {
        toast.error(errorMessage?.[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  if (!user) return null;

  return (
    <div className="flex w-full items-center gap-6">
      <Image
        src={user.profileImageUrl}
        alt={`@${user.username}'s profile image` ?? "Profile image"}
        height={52}
        width={52}
        className="rounded-full"
      />
      <input
        type="text"
        placeholder="Type emojis!"
        className="grow border border-slate-400 bg-transparent p-3 text-lg outline-none"
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
        disabled={isPosting}
      />
      {input !== "" && (
        <button
          className="flex items-center justify-center border border-slate-400 p-3.5"
          onClick={() => mutate({ content: input })}
          disabled={isPosting}
        >
          {!isPosting ? "Post" : <LoadingSpinner className="h-6 w-6" />}
        </button>
      )}
      <span className="border border-slate-400 p-3.5">
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
        height={52}
        width={52}
        className="rounded-full"
      />
      <span className="flex flex-col">
        <span className="flex gap-1">
          <Link href={`@${author.username}`}>
            <p className="font-bold">@{author.username}</p>
          </Link>
          <p className="font-light text-slate-400">
            ~ {dayjs(post.createdAt).fromNow()}
          </p>
        </span>
        <Link href={`post/${post.id}`}>
          <p className="text-lg">{post?.content}</p>
        </Link>
      </span>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );

  if (!data) return <p>Something went wrong</p>;

  return (
    <div className="flex flex-col">
      {data.map((postWithAuthor) => (
        <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  // Start fetching asap, it will be available as cache
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-b-slate-400 p-4">
        {!isSignedIn && <SignInButton />}
        {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
}
