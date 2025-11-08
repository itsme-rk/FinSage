import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <h2>💰 Expense Tracker</h2>
      <ul>
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li><Link to="/expenses">My Expenses</Link></li>
            {user.role === "ADMIN" && <li><Link to="/admin">Admin Panel</Link></li>}
            <li onClick={logout} style={{ cursor: "pointer" }}>Logout</li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
