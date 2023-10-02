import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import PageLayout from "~/components/PageLayout";
import Image from "next/image";
import LoadingSpinner from "~/components/LoadingSpinner";
import PostView from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const ProfileFeed = (props: { userId: string }) => {
  const { data: posts, isLoading: postsLoading } =
    api.posts.getManyByUserId.useQuery({
      userId: props.userId,
    });

  if (postsLoading)
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );

  if (!posts) return <p>Something went wrong</p>;

  return (
    <div className="flex flex-col">
      {posts.map((postWithAuthor) => (
        <PostView {...postWithAuthor} key={postWithAuthor.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: user } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!user) return <div>404</div>;

  return (
    <PageLayout>
      <div className="border-b border-b-slate-400">
        <span className="relative block h-32 bg-slate-400 text-lg">
          <Image
            src={user.profileImageUrl}
            alt={`@${user.username}'s profile image` ?? "Profile image"}
            height={96}
            width={96}
            className="absolute -bottom-12 left-12 rounded-full border-4 border-black"
          />
        </span>
        <span className="flex h-32 items-center pl-8">
          <p className="text-xl font-bold">@{user.username}</p>
        </span>
      </div>
      <ProfileFeed userId={user.id} />
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSGHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await helpers.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
