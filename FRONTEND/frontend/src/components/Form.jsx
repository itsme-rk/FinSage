import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";
import toast from "react-hot-toast";

function Form({ route, method }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const name = method === "login" ? "Login" : "Register";

	const handleSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();

		try {
			const res = await api.post(route, { username, password });
			if (method === "login") {
				localStorage.setItem(ACCESS_TOKEN, res.data.access);
				localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
				navigate("/");
			} else {
				navigate("/login");
			}
		} catch (error) {
			const errorData = error.response?.data;
			if (errorData) {
				// Handle Django REST Framework validation errors
				Object.keys(errorData).forEach((key) => {
					const messages = Array.isArray(errorData[key])
						? errorData[key]
						: [errorData[key]];
					messages.forEach((message) => {
						toast.error(`${key.replace("_", " ")}: ${message}`);
					});
				});
			} else {
				toast.error("An unexpected error occurred. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>

        <p>
                {method === "login"
                    ? <>Don't have an account? <Link to="/register">Register</Link></>
                    : <>Already have an account? <Link to="/login">Login</Link></>
                }
            </p>
            
        </form>
    );
}

export default Form