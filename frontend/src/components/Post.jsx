import LikeButton from "./LikeButton.jsx";
import CommentSection from "./CommentSection.jsx";

function Post({ post }) {
  if (!post) return null;

  const { message, createdAt, user, _id, id } = post;
  const safeId = _id ?? id ?? undefined;
  const date =
    createdAt && !isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt).toLocaleString()
      : null;

  return (
    <article className="card card-hover p-6 space-y-4" data-post-id={safeId}>

      {user && (
        <small>
          Posted by: {user.username ?? user.email}
        </small>
      )}
      {date && (
        <small>
          <br />
          {/* Posted at: {date} */}
          <span data-testid="post-date">Posted at: {date}</span>

          <br />
          <br />
        </small> 
      )}
      <p className="text-lg sm:text-xl font-semibold leading-snug">
        {message ?? "(no message)"}
      </p>
      <LikeButton post={post} />
      <CommentSection postId={safeId} />

    </article>
  );
}

export default Post;