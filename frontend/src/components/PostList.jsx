const samplePosts = [
    { id: 1, author: "Alianna", content: "Hello, this is my first post!" },
    { id: 2, author: "Chris", content: "Good morning everyone!" },
    { id: 3, author: "Mark", content: "Loving this new app." },
    { id: 3, author: "Rebecca", content: "Hello Acebook!" }
];

function PostsList() {
    return (
        <div>
        {samplePosts.map(post => (
            <div key={post.id} style={{
            border: "1px solid #ccc",
            margin: "10px",
            padding: "10px",
            borderRadius: "5px"
            }}>
            <h4>{post.author}</h4>
            <p>{post.content}</p>
            </div>
        ))}
        </div>
    );
}

export default PostsList;
