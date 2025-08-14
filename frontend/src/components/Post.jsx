import LikeButton from "./LikeButton.jsx";

function Post({ post }) {
  const { message, createdAt, user, _id } = post;

  return (
    <article className="card card-hover p-6 space-y-4" data-post-id={_id}>
      {/* Message first for focus */}
      <p className="text-lg sm:text-xl font-semibold leading-snug">
        {message}
      </p>

      {/* Meta with required labels for tests */}
      <div className="flex items-center justify-between text-sm muted">
        <div className="space-y-1">
          {user && (
            <div data-testid="post-author">
              <span>Posted by: </span>
              <span className="font-medium text-menace-cream">
                {user.username || user.email}
              </span>
            </div>
          )}
          {createdAt && (
            <div data-testid="post-date">
              {`Posted at: ${new Date(createdAt).toLocaleString()}`}
            </div>
          )}
        </div>
        <LikeButton />
      </div>
    </article>
  );
}

export default Post;