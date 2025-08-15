import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import User from "../../components/User";
import LogoutButton from "../../components/LogoutButton";
import { getUserById, followUser, unfollowUser, updateUser } from "../../services/users";
import { useToast } from "../../hooks/useToast";

export function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFollowing, setIsFollowing] = useState(false);
  const [toggling, setToggling] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const { showToast, Toast } = useToast();

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
        setUsernameDraft(data.user.username || "");

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

      {viewingOwn && <LogoutButton />}
      <Toast />
    </div>
  );
}