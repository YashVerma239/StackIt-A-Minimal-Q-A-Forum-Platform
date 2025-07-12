import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const loggedIn = !!localStorage.getItem("token");

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between">
      <Link to="/" className="font-bold">StackIt</Link>
      <div className="space-x-4">
        {loggedIn ? (
          <>
            <Link to="/ask">Ask Question</Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/");
              }}
              className="underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
