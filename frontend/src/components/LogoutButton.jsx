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
      className="btn-primary px-4 py-2 rounded-lg text-white text-sm transition hover:bg-black hover:text-red-500"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
