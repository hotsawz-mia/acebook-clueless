import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import User from "../../components/User";
import LogoutButton from "../../components/LogoutButton";
import { getUserById, followUser, unfollowUser, updateUser, getFollowing } from "../../services/users";
import { useToast } from "../../hooks/useToast";
import Post from "../../components/Post";
import { getUserPosts } from "../../services/posts"

export function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [rowToggling, setRowToggling] = useState(new Set());
  const [following, setFollowing] = useState([]);
  const [followingLoading, setFollowingLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const { showToast, Toast } = useToast();

  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Added state just for posts
  const [posts, setPosts] = useState([]); // Keeps posts separate from user profile/following
  const [postsLoading, setPostsLoading] = useState(true); // Profile loading != posts loading

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    const target = userId || "me";
    let cancelled = false;
  
    // profile
    (async () => {
      try {
        setLoading(true);
        const data = await getUserById(target, token);
        if (cancelled) return;
        setUser(data.user);
        setUsernameDraft(data.user.username || "");
        if (userId && userId !== currentUserId) {
          const me = await getUserById("me", token);
          if (!cancelled) {
            setIsFollowing(me.user.following?.map(String).includes(String(userId)));
          }
        } else {
          setIsFollowing(false);
        }
      } catch (err) {
        console.error(err);
        if (String(err).includes("404")) setUser(null);
        else navigate("/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
  
    // following
    (async () => {
      try {
        setFollowingLoading(true);
        const f = await getFollowing(target, token);
        if (!cancelled) setFollowing(f.users ?? []);
      } catch (err) {
        console.error("getFollowing failed:", err);
        if (!cancelled) setFollowing([]);
      } finally {
        if (!cancelled) setFollowingLoading(false);
      }
    })();
  
    return () => { cancelled = true; };
  }, [navigate, userId, currentUserId, token]);

    // fetch only this user's posts
  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const targetId = userId || currentUserId;      // which user's posts
    let cancelled = false;

    (async () => {
      try {
        setPostsLoading(true);                      // start spinner for posts
        const { posts } = await getUserPosts(targetId, token);
        if (!cancelled) setPosts(posts ?? []);      // store array (empty if none)
      } catch (e) {
        if (!cancelled) setPosts([]);               // safe fallback
        if (e?.status === 401) navigate("/login");  // auth failure path
      } finally {
        if (!cancelled) setPostsLoading(false);     // stop spinner
      }
    })();

    return () => { cancelled = true; };             // avoid setState after unmount
  }, [userId, currentUserId, token, navigate]);


  async function handleFollowToggle() {
    if (!userId || userId === currentUserId) return;
    try {
      setToggling(true);
      if (isFollowing) {
        await unfollowUser(userId, token);
        setIsFollowing(false);
      } else {
        await followUser(userId, token);
        setIsFollowing(true);
      }
    } catch (e) {
      console.error("Follow toggle failed:", e);
    } finally {
      setToggling(false);
    }
  }

  async function handleRowUnfollow(targetId) {
    try {
      setRowToggling(prev => new Set(prev).add(String(targetId)));
      await unfollowUser(targetId, token);
      setFollowing(prev => prev.filter(u => String(u._id) !== String(targetId)));
    } catch (e) {
      console.error("Row unfollow failed:", e);
    } finally {
      setRowToggling(prev => {
        const next = new Set(prev);
        next.delete(String(targetId));
        return next;
      });
    }
  }

  async function handleSaveProfile() {
    try {
      setSaving(true);
      const updated = await updateUser("me", { username: usernameDraft }, token);
      setUser(updated.user ?? { ...user, username: usernameDraft });
      setEditMode(false);
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update profile:", err);
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold">User Not Found</h2>
        <p>Sorry, we couldn't find that user.</p>
      </div>
    );
  }

  const viewingOwn =
    userId === currentUserId || (!userId && user._id === currentUserId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">
        {viewingOwn ? "Your" : user.username || user.email} Profile
      </h2>

      {!viewingOwn && (
        <div>
          <button
            onClick={handleFollowToggle}
            disabled={toggling}
            aria-pressed={isFollowing}
            className={isFollowing ? "btn-outline" : "btn-primary shadow-menace"}
          >
            {toggling ? "Working..." : isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      )}

      {viewingOwn && (
        <div className="space-y-4">
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="btn-outline">
              Edit profile
            </button>
          ) : (
            <>
              <label className="block">
                <span className="text-sm font-medium">Username</span>
                <input
                  type="text"
                  value={usernameDraft}
                  onChange={(e) => setUsernameDraft(e.target.value)}
                  className="input mt-1 w-full"
                />
              </label>
              <div className="flex gap-2">
                <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setUsernameDraft(user.username || "");
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="space-y-4">
        <User user={user} />
      </div>

      {/* Entourage section */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold" aria-label="Following">
          Entourage
        </h3>
        {followingLoading ? (
            <p className="text-zinc-400">Loading…</p>
          ) : following.length === 0 ? (
            <p className="text-zinc-400">
              <span className="sr-only">Not following anyone yet.</span>
              Your entourage is empty.
            </p>
          ) : (
          <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
            {following.map((u) => (
              <li key={u._id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden">
                    {u.profilePicture ? (
                      <img src={u.profilePicture} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center">👤</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Link to={`/user/${u._id}`} className="font-medium hover:underline">
                      {u.username || u.email}
                    </Link>
                    <span className="text-xs text-zinc-500">
                      Member since {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/user/${u._id}`} className="btn-outline px-3 py-1 text-sm">
                    View
                  </Link>
                  {viewingOwn && (
                    <button
                      onClick={() => handleRowUnfollow(u._id)}
                      disabled={rowToggling.has(String(u._id))}
                      className="btn-outline px-2 py-1 text-sm"
                      aria-label={`Unfollow ${u.username || u.email}`}
                      title="Remove from entourage"
                    >
                      {rowToggling.has(String(u._id)) ? "…" : "✕"}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Posts section */}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold" aria-label="Posts">
        Their Posts
        </h3>

        <div className="space-y-4" role="feed" aria-busy={postsLoading}>
          {postsLoading ? (
            <p>Loading…</p>
          ) : posts.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="muted">No posts yet.</p>
            </div>
          ) : (
            posts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => (
              <div data-testid="post" key={post._id}>
                <Post post={post} />
              </div>
            ))
          )}
        </div>
      
      </section>

      {viewingOwn && <LogoutButton />}
      <Toast />
    </div>
  );
}