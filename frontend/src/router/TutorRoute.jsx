// src/router/TutorRoute.jsx
import { Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";

export default function TutorRoute({ children }) {
  const { auth } = useAuth();

  return (
    <ProtectedRoute>
      {auth.role === "TUTOR" ? children : <Navigate to="/login" />}
    </ProtectedRoute>
  );
}
