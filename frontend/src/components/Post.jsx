import "./Post.css";

// function Post(props) {
//   return <article key={props.post._id}>{props.post.message}</article>;
// }

// export default Post;

function Post(props) {
  const { message, createdAt, user, _id } = props.post;

  return (
    <article className="post-box" key={_id}>
      {user && (
        <small> 
          Posted by: {user.email /* or user.username if you have it */}
          <br /><br />
        </small>
      )}
      <p>{message}</p>

      {createdAt && (
        <small>
          <br />
          Posted at: {new Date(createdAt).toLocaleString()}
        </small>
      )}
    </article>
  );
}

export default Post;
