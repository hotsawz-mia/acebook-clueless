import React, {useState} from 'react'
import { GiEvilLove } from "react-icons/gi";

const LikeButton = () => {

    const [liked, setLiked] = useState(false);
    const toggleLike = () => {
        setLiked(!liked);
    };
    return (
    <button onClick={toggleLike} className="like-button">
        {liked ? <GiEvilLove color="black"/>: <GiEvilLove color="grey"/>}
    </button>
    )};

export default LikeButton;