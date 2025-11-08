import react from "react"
import { BrowserRouter as Router,Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./src/context/AuthContext";
import Login from "./src/pages/Login"
import Register from "./src/pages/Register"
import Home from "./src/pages/Home"
import NotFound from "./src/pages/NotFound"
import ProtectedRoute from "./src/components/ProtectedRoute"
import Navbar from "./src/components/Navbar";
import Expenses from "./src/pages/Expenses";
import AdminPanel from "./src/pages/AdminPanel";


function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
