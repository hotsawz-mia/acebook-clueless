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
  const [bioDraft, setBioDraft] = useState(""); {/* added this for edit Hobbies */}
  const [hobbiesDraft, setHobbiesDraft] = useState(""); {/* added this for edit Hobbies */}
  const [profilePictureDraft, setProfilePictureDraft] = useState(null); {/* added this for edit profilepic */}
  const [profilePicturePreview, setProfilePicturePreview] = useState("");
  const [backgroundPictureDraft, setBackgroundPictureDraft] = useState(null); {/* added this for edit profilepic */}
  const [backgroundPicturePreview, setBackgroundPicturePreview] = useState("");
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
        setBioDraft(data.user.bio || "");   {/* added this for edit Hobbies */}
        setHobbiesDraft(Array.isArray(data.user.hobbies) ? data.user.hobbies.join(", ") : (data.user.hobbies || "")); {/* added this for edit Hobbies */}
        setProfilePicturePreview(data.user.profilePicture || "");  {/* added this for edit profilepic */}
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

      const hobbiesArray = Array.isArray(hobbiesDraft) ? hobbiesDraft : hobbiesDraft.split(",").map(h => h.trim()).filter(Boolean); {/* added this for edit Hobbies */}

      const formData = new FormData();
        formData.append("username", usernameDraft);
        formData.append("bio", bioDraft);
        formData.append("hobbies", JSON.stringify(hobbiesArray));
        if (profilePictureDraft) {
          formData.append("profilePicture", profilePictureDraft); // must match multer field
        }
        if (backgroundPictureDraft) {
          formData.append("backgroundPicture", backgroundPictureDraft); // must match multer field
        }

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      const updated = await res.json();

      setUser(updated.user ?? {
        ...user,
        username: usernameDraft,
        bio: bioDraft,
        hobbies: hobbiesArray,
        profilePicture: updated.user?.profilePicture || user.profilePicture,
        backgroundPicture: updated.user?.backgroundPicture || user.backgroundPicture,
      });
      setEditMode(false);
      showToast("Profile updated successfully!", "success");

      // const updated = await updateUser("me", { username: usernameDraft, bio: bioDraft, hobbies: hobbiesArray, profilePicture: profilePictureDraft }, token); {/* added this for edit Hobbies */}
      // setUser(updated.user ?? { ...user, username: usernameDraft, bio: bioDraft, hobbies: hobbiesArray, profilePicture: profilePictureDraft }); {/* added this for edit Hobbies and profile pic */} 
      // setEditMode(false);
      // showToast("Profile updated successfully!", "success");



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
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="font-metal text-5xl">
        {viewingOwn 
          ? "Your" 
          : `${user.username || user.email}'s`} Profile
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
        <div className="space-y-4" >
          {!editMode ? (

            <button onClick={() => setEditMode(true)} className="btn-outline" aria-label="edit profile">

              Distort Persona
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
                {/* added this for edit Bio */}
              <label className="block">
                <span className="text-sm font-medium">Bio</span>
                <textarea
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  className="input mt-1 w-full resize-y" rows={3}
                />
              </label>
                {/* added this for edit Hobbies */}
              <label className="block">
                <span className="text-sm font-medium">Hobbies</span>
                <input
                  type="text"
                  value={hobbiesDraft}
                  onChange={(e) => setHobbiesDraft(e.target.value)}
                  className="input mt-1 w-full"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Profile Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setProfilePictureDraft(file);
                    if (file) setProfilePicturePreview(URL.createObjectURL(file));
                  }}
                  className="input mt-1 w-full"
                />
              </label>
                      {/* added the profile pic above and below */}
              {profilePicturePreview && (
                <img
                  src={profilePicturePreview}
                  alt="Preview"
                  className="mt-1 w-24 h-24 object-cover rounded-full"
                />
              )}

              <label className="block">
                <span className="text-sm font-medium">Picture of Lair</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setBackgroundPictureDraft(file);
                    if (file) setBackgroundPicturePreview(URL.createObjectURL(file));
                  }}
                  className="input mt-1 w-full"
                />
              </label>
                      {/* added the profile pic above and below */}
              {backgroundPicturePreview && (
                <img
                  src={backgroundPicturePreview}
                  alt="Preview"
                  className="mt-1 w-24 h-24 object-cover"
                />
              )}


              <div className="flex gap-2">    
                <button onClick={handleSaveProfile} disabled={saving} className="btn-primary">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setUsernameDraft(user.username || "");
                    setBioDraft(user.bio || "");
                    setHobbiesDraft(Array.isArray(user.hobbies) ? user.hobbies.join(", ") : (user.hobbies || ""));
                    setProfilePictureDraft(null); // reset file
                    setProfilePicturePreview(user.profilePicture || ""); 
                    setBackgroundPictureDraft(null); // reset file
                    setBackgroundPicturePreview(user.profilePicture || "");// reset to stored image
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

      <div className="flex items-start gap-6 ml-0 w-full">
        {/* Left side */}
        <div className="w-200">
          <User user={user} />
        </div>

        {/* Right side */}
        
          {user.backgroundPicture && (
            <div className="w-300 rounded-md overflow-hidden border border-zinc-800">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${user.backgroundPicture}?t=${Date.now()}`}
              alt="Background"
              className="w-full h-full object-cover"
            />
            </div>
          )}

      </div>

      {/* Entourage section */}
      <section className="w-80 mx-auto space-y-3 ml-0">
        <h3 className="font-metal text-2xl" aria-label="Following">
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
          {following.map((u) => {
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const profilePicUrl = u.profilePicture
              ? `${BACKEND_URL}${u.profilePicture}`
              : null;

            return (
              <li key={u._id} className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 overflow-hidden">
                    {profilePicUrl ? (
                      <img
                        src={profilePicUrl}
                        alt={`${u.username}'s profile`}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center">👤</div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <Link to={`/user/${u._id}`} className="font-medium hover:underline">
                      {u.username || u.email}
                    </Link>
                    <span className="text-xs text-zinc-500">
                      Member since{" "}
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString()
                        : "—"}
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
            );
          })}
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