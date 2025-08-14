import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import LogoutButton from "../../components/LogoutButton";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    getPosts(token)
      .then((data) => setPosts(data.posts ?? []))
      .catch((err) => {
        console.error(err);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <main className="shell">
      {/* Sticky header */}
      <div className="sticky top-[64px] z-10 px-4">
        <header className="card glass max-w-3xl mx-auto mt-6 p-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl">Menacing Posts</h2>
            <p className="section-subtitle mt-1">
              Latest activity from the Global Menace Network
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              className="btn-primary shadow-menace"
              onClick={() => navigate("/create-post")}
            >
              Create New Post
            </button>
            <LogoutButton className="btn-ghost" />
          </div>
        </header>
      </div>

      <section className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Mobile actions */}
        <div className="sm:hidden flex gap-3">
          <button
            className="btn-primary flex-1 shadow-menace"
            onClick={() => navigate("/create-post")}
          >
            Create New Post
          </button>
          <LogoutButton className="btn-outline" />
        </div>

        {/* Feed */}
        <div className="space-y-4" role="feed" aria-busy={loading}>
          {loading ? (
            // Skeletons
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="card p-5 animate-pulse border-white/10 bg-white/[0.04]"
              >
                <div className="h-4 w-40 bg-white/10 rounded mb-3" />
                <div className="h-20 bg-white/10 rounded" />
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="muted">No posts yet.</p>
              <button
                className="btn-primary mt-4"
                onClick={() => navigate("/create-post")}
              >
                Be the first to post
              </button>
            </div>
          ) : (
            [...posts]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => (
                // Important: no extra card wrapper to avoid double surfaces
                <Post post={post} key={post._id} />
              ))
          )}
        </div>

        <footer className="footer pt-6 text-center">
          <p>© Global Menace Network</p>
        </footer>
      </section>
    </main>
  );
}