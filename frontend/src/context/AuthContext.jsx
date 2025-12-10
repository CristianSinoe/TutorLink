// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    email: null,
    name: null,
    loading: true, // 👈 importante
  });

  useEffect(() => {
    const saved = localStorage.getItem("auth");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAuth({
          ...parsed,
          loading: false,
        });
      } catch (e) {
        console.error("Error parseando auth de localStorage", e);
        setAuth((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setAuth((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = ({ token, role, email, name }) => {
    const data = { token, role, email, name };
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth({ ...data, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth({
      token: null,
      role: null,
      email: null,
      name: null,
      loading: false,
    });
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {auth.loading ? (
        <div className="w-full h-screen flex items-center justify-center text-slate-500">
          Cargando sesión…
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
