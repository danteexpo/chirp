import type { NextPage } from "next";
import PageLayout from "~/components/PageLayout";

const PostPage: NextPage = () => {
  return (
    <>
      <PageLayout>
        <div className="flex border-b border-b-slate-400 p-4">Post</div>
      </PageLayout>
    </>
  );
};

export default PostPage;
