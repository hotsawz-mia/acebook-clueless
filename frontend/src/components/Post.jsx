// function Post(props) {
//   return <article key={props.post._id}>{props.post.message}</article>;
// }

// export default Post;

function Post(props) {
  const { message, createdAt, _id, email} = props.post;

  return (
    <article key={_id}>
      <p>{email}</p>
      <p>{message}</p>
      {createdAt && (
        <small>
          Posted at: {new Date(createdAt).toLocaleString()}
        </small>
      )}
    </article>
  );
}

export default Post;