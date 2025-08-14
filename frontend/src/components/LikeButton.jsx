import React, { useState } from "react";
import { GiEvilLove } from "react-icons/gi";

const LikeButton = () => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <button
      onClick={toggleLike}
      className={`p-2 rounded-full transition 
        ${liked ? "text-menace-red" : "text-menace-cream/60"} 
        hover:text-menace-red hover:bg-menace-red/10`}
      aria-label="Like"
    >
      <GiEvilLove size={28} />
    </button>
  );
};

export default LikeButton;