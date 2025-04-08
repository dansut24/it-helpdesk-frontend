import React, { createContext, useState, useEffect, useContext } from "react";

// ✅ Create Auth Context
const AuthContext = createContext();

// ✅ AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      parsed.roles = Array.isArray(parsed.roles) ? parsed.roles : [parsed.roles];
      setUser(parsed);
    } else if (token) {
      try {
        const [, payload] = token.split(".");
        const decoded = JSON.parse(atob(payload));
        const reconstructedUser = {
          username: decoded.username,
          email: decoded.email,
          roles: Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles],
          id: decoded.id,
          team_id: decoded.team_id,
          avatar_url: decoded.avatar_url,
          token,
        };
        setUser(reconstructedUser);
        sessionStorage.setItem("user", JSON.stringify(reconstructedUser));
      } catch (err) {
        console.error("❌ Failed to decode token:", err);
      }
    }
  }, []);

  const login = (userData) => {
    const parsedRoles = Array.isArray(userData.roles) ? userData.roles : [userData.roles];
    const updatedUser = { ...userData, roles: parsedRoles };
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    sessionStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook for `useAuth`
export const useAuth = () => {
  return useContext(AuthContext);
};

export { AuthContext };