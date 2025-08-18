import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../../components/Post";
import LogoutButton from "../../components/LogoutButton";
import PostComposer from "../../components/PostComposer";

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const refresh = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    return getPosts(token).then((data) => setPosts(data.posts ?? []));
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      setLoading(false);
      return;
    }
    refresh().finally(() => setLoading(false));
  }, [refresh, navigate]);

  function handleCreated(created) {
    if (created?._id) {
      setPosts((prev) => [created, ...prev]);
    } else {
      refresh();
    }
  }

  return (
    <main className="shell">
      {/* board info */}
      <div className="hidden sm:flex flex-col items-center gap-1">
        <h2 className="text-2xl">Board of Misdeeds</h2>
        <p className="section-subtitle mt-1">
          Latest activity from the Global Menace Network
        </p>
      </div>


      {/* Sticky header with inline composer */}
      <div className="sticky top-4 z-10 px-4">
        <header className="card glass max-w-3xl mx-auto mt-2 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">

              <PostComposer onCreated={handleCreated} />
            </div>
          </div>
        </header>

      </div>


      <section className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Feed */}
        <div className="space-y-4" role="feed" aria-busy={loading}>
          {loading ? (
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
            </div>
          ) : (
            [...posts]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((post) => <Post post={post} key={post._id} />)
          )}
        </div>

        <footer className="footer pt-6 text-center">
          <p>© Global Menace Network</p>
        </footer>
      </section>
    </main>
  );
}