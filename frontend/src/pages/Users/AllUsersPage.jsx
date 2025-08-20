import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUsers, getUserById, followUser, unfollowUser } from "../../services/users";
import LogoutButton from "../../components/LogoutButton";

export function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingSet, setFollowingSet] = useState(new Set());
  const [rowToggling, setRowToggling] = useState(new Set());
  const navigate = useNavigate();

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    setLoading(true);
    Promise.all([getUsers(token), getUserById("me", token)])
      .then(([data, me]) => {
        const meId = String(me.user._id);
        const filtered = (data.users || []).filter(u => String(u._id) !== meId);
        setUsers(filtered);
        const fset = new Set((me.user.following || []).map(String));
        setFollowingSet(fset);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="font-metal text-5xl">Loading Users...</h2>
      </div>
    );
  }

  async function toggleFollow(targetId) {
    const id = String(targetId);
    try {
      setRowToggling(prev => new Set(prev).add(id));
      const already = followingSet.has(id);
      if (already) {
        await unfollowUser(id, localStorage.getItem("token"));
        setFollowingSet(prev => {
          const n = new Set(prev);
          n.delete(id);
          return n;
        });
      } else {
        await followUser(id, localStorage.getItem("token"));
        setFollowingSet(prev => new Set(prev).add(id));
      }
    } catch (e) {
      console.error("toggleFollow failed:", e);
    } finally {
      setRowToggling(prev => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="font-metal text-5xl">All Users</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user._id} className="card p-4 hover:border-white/20 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center overflow-hidden">
                  {(() => {
                    const url = user.profilePicture?.startsWith("http")
                      ? user.profilePicture
                      : user.profilePicture
                      ? `${BACKEND_URL}${user.profilePicture}`
                      : null;
                    return url ? (
                      <img src={url} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <span className="text-xl">👤</span>
                    );
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-menace-cream truncate">{user.username || 'No username'}</h3>
                  <p className="text-sm text-menace-cream/70 truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link to={`/user/${user._id}`} className="btn-primary flex-1 text-center">View Profile</Link>
                  <button
                    aria-label={followingSet.has(String(user._id)) ? "Unfollow" : "Follow"}
                    title={followingSet.has(String(user._id)) ? "Unfollow" : "Follow"}
                    className={`px-3 py-2 rounded-lg border ${followingSet.has(String(user._id)) ? "border-zinc-700" : "border-menace-cream/40"} hover:border-menace-cream/80 transition`}
                    disabled={rowToggling.has(String(user._id))}
                    onClick={() => toggleFollow(user._id)}
                  >
                    {rowToggling.has(String(user._id)) ? "…" : (followingSet.has(String(user._id)) ? "✓" : "+")}
                  </button>
                </div>
                {user.bio && (
                  <p className="text-sm text-menace-cream/90 line-clamp-2">{user.bio}</p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
