import { useNavigate } from "react-router-dom";

function LogoutButton({ setIsLoggedIn }) {
  const navigate = useNavigate();

  function logOut() {
    localStorage.removeItem("token");
    setIsLoggedIn(false); 
    window.dispatchEvent(new Event("storage"));
    navigate("/"); // sends you back to homepage
  }

  return (
    <button
      onClick={logOut}
      className="text-menace-cream/80 hover:text-menace-cream transition-colors"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
