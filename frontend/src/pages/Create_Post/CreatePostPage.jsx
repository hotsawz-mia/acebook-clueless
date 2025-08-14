import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../services/posts"; // Adjust path if needed

export function CreatePostPage() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await createPost(message, token);
      navigate("/posts"); // Use your actual feed route
    } catch (err) {
      console.error(err);
      navigate("/posts");
    }
  }

  function handleMessageChange(event) {
    setMessage(event.target.value);
  }

  return (
    <>
      <h2>Create Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="message">Message:</label>
        <input
          id="message"
          type="text"
          value={message}
          onChange={handleMessageChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </>
  );
}