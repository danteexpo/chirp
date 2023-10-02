import Head from "next/head";
import { useParams } from "next/navigation";

const PostPage = () => {
  // const { id } = useParams();

  return (
    <>
      <Head>
        <title>Chirp | Post Emojis!</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full md:max-w-2xl md:border-x md:border-x-slate-400">
          <div className="flex border-b border-b-slate-400 p-4">Post</div>
        </div>
      </main>
    </>
  );
};

export default PostPage;
