import LikeButton from "./LikeButton.jsx";

function Post({ post }) {
  const { message, createdAt, user, _id } = post;

  return (
    <article className="card card-hover p-6 space-y-4" data-post-id={_id}>
      {/* Message first */}
      <p className="text-lg sm:text-xl font-semibold leading-snug">
        {message}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between text-sm muted">
        <div>
          {user && (
            <span>
              Posted by{" "}
              <span className="font-medium text-menace-cream">
                {user.username || user.email}
              </span>
            </span>
          )}
          {createdAt && (
            <div>{new Date(createdAt).toLocaleString()}</div>
          )}
        </div>
        <LikeButton />
      </div>
    </article>
  );
}

export default Post;