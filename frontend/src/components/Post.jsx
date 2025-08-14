import LikeButton from "./LikeButton.jsx";

function Post({ post }) {
  if (!post) return null;

  const { message, createdAt, user, _id, id } = post;
  const safeId = _id ?? id ?? undefined;
  const date =
    createdAt && !Number.isNaN(new Date(createdAt))
      ? new Date(createdAt).toLocaleString()
      : null;

  return (
    <article className="card card-hover p-6 space-y-4" data-post-id={safeId}>
      <p className="text-lg sm:text-xl font-semibold leading-snug">
        {message ?? "(no message)"}
      </p>

      <div className="flex items-center justify-between text-sm muted">
        <div className="space-y-1">
          {user && (
            <div data-testid="post-author">
              <span>Posted by: </span>
              <span className="font-medium text-menace-cream">
                {user.username ?? user.email}
              </span>
            </div>
          )}
          {date && <div data-testid="post-date">Posted at: {date}</div>}
        </div>
        <LikeButton post={post} />
      </div>
    </article>
  );
}

export default Post;