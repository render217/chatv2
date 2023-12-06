/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../api";
import { Loading } from "../components";
const INITIAL_USER = {
  username: "",
  email: "",
  bio: "",
  _id: "",
};
const INITIAL_CONTEXT = {
  user: INITIAL_USER,
  isAuthenticated: false,
  isLoading: false,
  setIsAuthenticated: () => {},
  setUser: () => {},
  logout: () => {},
  setCookie: () => {},
  getCookie: () => {},
};
const AuthContext = createContext(INITIAL_CONTEXT);

export default function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const { data } = await api.getCurrent();

      if (data.success) {
        setUser({
          _id: data.payload.user?._id,
          username: data.payload.user?.username,
          bio: data.payload.user?.bio || "",
          email: data.payload.user?.email,
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
    } finally {
      // await new Promise((resolve) => setTimeout(resolve, 4000));
      setIsLoading(false);
    }
  };

  const getCookie = () => {
    return Cookies.get("token");
  };

  const setCookie = (token) => {
    Cookies.set("token", token);
  };

  const logout = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
    Cookies.remove("token");
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========value===========
  const value = {
    isLoading,
    user,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    logout,
    setCookie,
    getCookie,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>{isLoading ? <Loading /> : children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
