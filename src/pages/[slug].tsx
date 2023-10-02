import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <PageLayout>
        <div className="border-b border-b-slate-400">
          <span className="relative block h-32 bg-slate-400 text-lg">
            <Image
              src={data?.profileImageUrl}
              alt={`@${data?.username}'s profile image` ?? "Profile image"}
              height={96}
              width={96}
              className="absolute -bottom-12 left-12 rounded-full border-4 border-black"
            />
          </span>
          <span className="flex h-32 items-center pl-8">
            <p className="text-xl font-bold">@{data?.username}</p>
          </span>
        </div>
      </PageLayout>
    </>
  );
};

import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import superjson from "superjson";
import PageLayout from "~/components/PageLayout";
import Image from "next/image";

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson, // optional - adds superjson serialization
  });

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
