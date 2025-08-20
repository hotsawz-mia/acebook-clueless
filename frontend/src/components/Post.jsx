import LikeButton from "./LikeButton.jsx";
import CommentSection from "./CommentSection.jsx";
import Avatar from "./Avatar.jsx"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function Post({ post }) {
  if (!post) return null;

  const { message, createdAt, user, _id, id, photoUrl } = post;
  const safeId = _id ?? id ?? undefined;

  const date =
    createdAt && !isNaN(new Date(createdAt).getTime())
      ? new Date(createdAt).toLocaleString()
      : null;

  return (
    <article className="card card-hover p-6 space-y-4" data-post-id={safeId}>
      {(user || date) && (
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <Avatar 
            src={user?.profilePicture} 
            alt={`${user.username}'s avatar`} 
            className="w-15 h-15 rounded-full" 
          />
          <div felx flex-col>
            {user && <span>Posted by: {user.username ?? user.email}</span>} <br />
            {date && (<span data-testid="post-date">Posted at: {date}</span>
            )}
          </div>
        </div>
      )}
      <p className="text-lg sm:text-xl font-semibold leading-snug">
        {message ?? "(no message)"}
      </p>

      {/* Display photo if available */}
      {photoUrl && (
        <img
          src={`${BACKEND_URL}${photoUrl}`}  // <-- prepend backend URL here
          alt="Post attachment"
          className="max-w-full max-h-96 rounded-md mt-4 object-contain"
        />
      )}

      <LikeButton post={post} />
      <CommentSection postId={safeId} />
    </article>
  );
}

export default Post;
