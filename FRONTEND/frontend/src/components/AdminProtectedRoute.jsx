import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function AdminProtectedRoute({ children }) {
	const { user } = useAuth();

	return (
		<ProtectedRoute>
			{user && user.role === "ADMIN" ? children : <Navigate to="/" />}
		</ProtectedRoute>
	);
}

export default AdminProtectedRoute;
