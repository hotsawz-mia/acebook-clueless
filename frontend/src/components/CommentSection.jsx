import { useState } from "react";
import { useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect (() => {
    if (!postId) return;
    const token = localStorage.getItem("token");
    
        fetch(`${BACKEND_URL}/posts/${postId}/comments`,  {
            headers: {
            Authorization: `Bearer ${token}`
            }
        })
    .then (res => res.json())
    .then (data => setComments (data.comments || []))
    .catch(err => console.error(err));
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BACKEND_URL}/posts/${postId}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: newComment }),
        });

    if (!res.ok) throw new Error("Failed to add comment");

        const data = await res.json();
        setComments(data.comments); // backend sends updated comments array
        setNewComment("");
        } catch (err) {
        console.error(err);
        }
    };


    return (
        <div className="mt-4 border-t border-gray-300 pt-4">
        <h3 className="font-semibold mb-2">Wicket Remarks</h3>

        {/* List of comments */}
        <div className="space-y-2 mb-4">
            {comments.length === 0 && (
            <p className="text-gray-500 text-sm">No wicked remarks yet. Be the first!</p>
            )}
            {comments.map((comment) => (
            <div
                key={comment.id}
                className="bg-black-100 border border-gray-300 p-2 rounded-lg text-sm"
            >
                {comment.text}
            </div>
            ))}
        </div>

        {/* Comment form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-"
            />
            <button
            type="submit"
            disabled={!newComment.trim()} // disables button if input is empty or only spaces
            className={`px-4 py-2 rounded-lg text-sm transition 
                ${newComment.trim() 
                ? "btn-primary text-white flicker" 
                : "btn-primary text-white disabled:opacity-60 cursor-not-allowed"}`}
            //className="btn-primary shadow-menace disabled:opacity-60 disabled:cursor-not-allowed flicker"
            >
            Submit
            </button>
        </form>
        </div>
    );
};

export default CommentSection;
