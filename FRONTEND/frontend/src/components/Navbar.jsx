import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">
          💰 FinSage
        </h2>

        <ul className="flex items-center gap-6 text-gray-700 font-medium">
          <li>
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  to="/expenses"
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  My Expenses
                </Link>
              </li>
              {user.role === "ADMIN" && (
                <li>
                  <Link
                    to="/admin"
                    className="hover:text-blue-600 transition-colors duration-200"
                  >
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={logout}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="border border-blue-600 text-blue-600 px-3 py-1.5 rounded-md hover:bg-blue-50 transition"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;



// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// function Navbar() {
//   const { user, logout } = useAuth();

//   return (
//     <nav className="navbar">
//       <h2>💰 Expense Tracker</h2>
//       <ul>
//         <li><Link to="/">Home</Link></li>
//         {user ? (
//           <>
//             <li><Link to="/expenses">My Expenses</Link></li>
//             {user.role === "ADMIN" && <li><Link to="/admin">Admin Panel</Link></li>}
//             <li onClick={logout} style={{ cursor: "pointer" }}>Logout</li>
//           </>
//         ) : (
//           <>
//             <li><Link to="/login">Login</Link></li>
//             <li><Link to="/register">Register</Link></li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// }

// export default Navbar;
