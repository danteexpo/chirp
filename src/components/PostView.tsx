import Image from "next/image";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
          <Link href={`/@${author.username}`}>
            <p className="font-bold">@{author.username}</p>
          </Link>
          <p className="font-light text-slate-400">
            ~ {dayjs(post.createdAt).fromNow()}
          </p>
        </span>
        <Link href={`/post/${post.id}`}>
          <p className="text-lg">{post?.content}</p>
        </Link>
      </span>
    </div>
  );
};

export default PostView;
