function User({ user }) {
  const currentUserId = localStorage.getItem("userId");

  return (
    <article className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">
            {user.username || "No username"}
          </h3>
          {/* Show email only if it's your own profile */}
          {user._id === currentUserId && (
            <p className="text-zinc-400">{user.email}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Bio</h4>
          <p className="text-zinc-300">{user.bio}</p>
        </div>
      )}

      {/* Hobbies */}
      {user.hobbies?.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Hobbies</h4>
          <div className="flex flex-wrap gap-2">
            {user.hobbies.map((hobby, index) => (
              <span
                key={index}
                className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Member Since */}
      <div className="text-sm text-zinc-500">
        Member since:{" "}
        {user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "Unknown"}
      </div>
    </article>
  );
}

export default User;
