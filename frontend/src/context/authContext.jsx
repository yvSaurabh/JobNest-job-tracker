import { createContext, useState } from "react";

const getStoredUser = () => {
  const savedUser = localStorage.getItem("jobnestUser");
  return savedUser ? JSON.parse(savedUser) : null;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  const login = (userData) => {
    localStorage.setItem("jobnestUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jobnestUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
