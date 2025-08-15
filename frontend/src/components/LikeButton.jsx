import React, { useState, useEffect } from 'react';
import { GiEvilLove } from "react-icons/gi";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LikeButton = ({ post = { likes: 0, _id: null, likedByUser: false } }) => {
  const [liked, setLiked] = useState(post.likedByUser ?? false); // track if user liked this post
  const [likes, setLikes] = useState(post.likes ?? 0);

  useEffect(() => {
  const localLike = localStorage.getItem(`liked-${post._id}`);
  if (localLike) {
    setLiked(true);
  } else {
    setLiked(post.likedByUser ?? false);
  }
}, [post]);

  const toggleLike = async () => {
    if (!post._id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BACKEND_URL}/posts/${post._id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });  

      if (!res.ok) throw new Error("Failed to like post");

      const data = await res.json();
      setLikes(data.likes ?? likes); // update likes from backend
      setLiked(data.likedByUser ?? !liked); // update liked state from backend or toggle
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <button onClick={toggleLike} className={`flex items-center gap-2  p-2 rounded-full transition 
        ${liked ? "text-menace-red" : "text-menace-cream/60"} 
        hover:text-menace-red hover:bg-menace-red/10`}
      aria-label="Like"
    >
      <GiEvilLove size={28} />
      <span>{likes}</span>
    </button>
  );
};

export default LikeButton;
