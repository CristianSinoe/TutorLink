// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";

// ADMIN
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentsPage from "./pages/admin/StudentsPage";
import TutorsPage from "./pages/admin/TutorsPage";
import AssignmentsPage from "./pages/admin/AssignmentsPage";
import UsersPage from "./pages/admin/UsersPage";
import AdminAdminsPage from "./pages/admin/AdminAdminsPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage"; // ← NUEVO

// STUDENT
import StudentLayout from "./layout/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentNewQuestion from "./pages/student/StudentNewQuestion";
import StudentInfoPage from "./pages/student/StudentInfoPage";
import StudentQuestions from "./pages/student/StudentQuestions";

// TUTOR
import TutorLayout from "./layout/TutorLayout";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorPendingPage from "./pages/tutor/TutorPendingPage";
import TutorHistoryPage from "./pages/tutor/TutorHistoryPage";
import TutorProfilePage from "./pages/tutor/TutorProfilePage";

// AUTH extra
import FirstLoginPage from "./pages/auth/FirstLoginPage";
import OtpPage from "./pages/auth/OtpPage";

// RUTAS PROTEGIDAS
import ProtectedRoute from "./router/ProtectedRoute";
import AdminRoute from "./router/AdminRoute";
import StudentRoute from "./router/StudentRoute";
import TutorRoute from "./router/TutorRoute";

function App() {
  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* OTP (segunda fase de login) */}
      <Route path="/otp" element={<OtpPage />} />

      {/* ADMIN */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="tutors" element={<TutorsPage />} />
        <Route path="assignments" element={<AssignmentsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="admins" element={<AdminAdminsPage />} />
        {/* NUEVO: perfil del admin */}
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>

      {/* STUDENT */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute>
            <StudentRoute>
              <StudentLayout />
            </StudentRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
        <Route path="ask" element={<StudentNewQuestion />} />
        <Route path="questions" element={<StudentQuestions />} />
        <Route path="info" element={<StudentInfoPage />} />
      </Route>

      {/* TUTOR */}
      <Route
        path="/tutor/*"
        element={
          <ProtectedRoute>
            <TutorRoute>
              <TutorLayout />
            </TutorRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<TutorDashboard />} />
        <Route path="pending" element={<TutorPendingPage />} />
        <Route path="history" element={<TutorHistoryPage />} />
        <Route path="profile" element={<TutorProfilePage />} />
      </Route>

      {/* FIRST LOGIN (activar cuenta) */}
      <Route path="/first-login" element={<FirstLoginPage />} />

      {/* REDIRECCIONES */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
