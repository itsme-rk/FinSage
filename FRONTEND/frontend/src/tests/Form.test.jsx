import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router } from "react-router-dom";
import Form from "../components/Form";
import api from "../api";
import toast from "react-hot-toast";
import { vi } from "vitest";

// Mock the api and toast modules
vi.mock("../api");
vi.mock("react-hot-toast");

describe("Form Component", () => {
	it("should display a toast error message on failed login", async () => {
		// Arrange
		const errorMessage = "Invalid credentials";
		api.post.mockRejectedValue({
			response: {
				data: { detail: errorMessage },
			},
		});
		const user = userEvent.setup();

		render(
			<Router>
				<Form route="/api/token/" method="login" />
			</Router>
		);

		// Act
		await user.type(screen.getByPlaceholderText("Username"), "testuser");
		await user.type(screen.getByPlaceholderText("Password"), "wrongpassword");
		await user.click(screen.getByRole("button", { name: "Login" }));

		// Assert
		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(`detail: ${errorMessage}`);
		});
	});
});
