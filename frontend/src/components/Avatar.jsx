

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


// function Avatar({ src, alt, className }) {
//     const imgSrc = src ? `${BACKEND_URL}${src}` : "/default-avatar.png";
//     return <img src={imgSrc} alt={alt} className={className} />;
// }
// export default Avatar;

function Avatar({ src, className }) {
  // Use backend URL for relative paths
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  let profilePicUrl = null;
  if (src && src.startsWith("http")) {
    profilePicUrl = src;
  } else if (src) {
    profilePicUrl = `${BACKEND_URL}${src}`;
  }

  return (
    <div>
      {profilePicUrl ? (
        <img
          src={profilePicUrl}
          alt="Profile"
          className="w-12 h-12 rounded-full"
        />
      ) : (
        <span className="text-xl">👤</span>
      )}
    </div>
  );
}

export default Avatar;