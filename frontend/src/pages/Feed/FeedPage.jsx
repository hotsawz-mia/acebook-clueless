import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import LogoutButton from "../../components/LogoutButton";
import LikeButton from "../../components/LikeButton.jsx";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getPosts(token)
        .then((data) => setPosts(data.posts))
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (

    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Menacing Posts</h2>

      <button
        className="btn-primary"
        onClick={() => navigate("/create-post")}
      >
        Create New Post
      </button>

      <div className="space-y-4" role="feed">
        {[...posts]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((post) => (
            <Post post={post} key={post._id} />
          ))}

      </div>

      <LogoutButton />
    </div>
  );
}