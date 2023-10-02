import type { GetStaticProps, NextPage } from "next";
import { api } from "~/utils/api";
import PageLayout from "~/components/PageLayout";
import PostView from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>;

  return (
    <PageLayout>
      <PostView {...data} />
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await helpers.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default PostPage;
