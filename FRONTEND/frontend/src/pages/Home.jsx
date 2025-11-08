import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useAuth();

  return (
    <div className="p-10 text-center bg-gray-50 min-h-[80vh]">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Welcome to FinSage 💼
      </h1>
      <p className="text-gray-600 max-w-xl mx-auto mb-8">
        {user
          ? `Hi ${user.username || "User"}! Track your expenses, manage reimbursements, and stay on top of your finances.`
          : "FinSage is an internal expense management system designed for teams to track, approve, and analyze expenses in real-time."}
      </p>

      {user ? (
        <div className="flex justify-center gap-4">
          <Link
            to="/expenses"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </Link>
          {user.role === "ADMIN" && (
            <Link
              to="/admin"
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition"
            >
              Admin Panel
            </Link>
          )}
        </div>
      ) : (
        <div className="flex justify-center gap-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;


// import React from 'react'
// import { useState, useEffect } from "react";
// import api from "../api";

// function Home() {
//   return (
//     <div>Home</div>
//   )
// }

// export default Home