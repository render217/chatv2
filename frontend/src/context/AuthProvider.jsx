/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../api";
import { Loading } from "../components";
import { requestHandler } from "../util";
import { useNavigate } from "react-router-dom";
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
};
const AuthContext = createContext(INITIAL_CONTEXT);

export default function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    await requestHandler({
      api: async () => await api.getCurrent(),
      setLoading: setIsLoading,
      onSucess: (payload) => {
        setUser({
          _id: payload.user?._id,
          username: payload.user?.username,
          bio: payload.user?.bio || "",
          email: payload.user?.email,
        });
        setIsAuthenticated(true);
      },
      onError: (error) => {
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
      },
    });
  };

  const logout = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
    Cookies.remove("chat_token");
  };

  useEffect(() => {
    const _token = Cookies.get("chat_token");
    const _user = Cookies.get("chat_user") ? JSON.parse(Cookies.get("chat_user")) : null;

    if (_token && _user) {
      setUser(_user);
      setIsAuthenticated(true);
      navigate("/");
    } else {
      checkAuth();
    }

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
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>{isLoading ? <Loading /> : children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
