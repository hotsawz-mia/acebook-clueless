import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import User from "../../components/User";
import LogoutButton from "../../components/LogoutButton";
import { getUserById, followUser, unfollowUser } from "../../services/users"; 

export function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);           
  const [toggling, setToggling] = useState(false);                 
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId = localStorage.getItem("userId"); 
  const token = localStorage.getItem("token");                     

  useEffect(() => {
    if (!token) return navigate("/login");

    const targetUserId = userId || "me";
    setLoading(true);

    getUserById(targetUserId, token)
      .then(async (data) => {
        setUser(data.user);
        // compute following state only when viewing someone else
        if (userId && userId !== currentUserId) {
          const me = await getUserById("me", token);
          setIsFollowing(me.user.following?.map(String).includes(String(userId)));
        } else {
          setIsFollowing(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (String(err).includes("404")) setUser(null);
        else navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate, userId, currentUserId, token]);

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
        {viewingOwn ? "Your" : user.username || user.email}{" "}Profile
      </h2>

      {/* Follow/Unfollow button when viewing someone else */}
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

      <div className="space-y-4">
        <User user={user} />
      </div>

      {viewingOwn && <LogoutButton />}
    </div>
  );
}