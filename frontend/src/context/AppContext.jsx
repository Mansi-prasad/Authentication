import { createContext, useContext, useEffect, useState } from "react";
import { serverUrl } from "../App";
import api from "../apiIntercepter";
import { toast } from "react-toastify";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  async function fetchUser() {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/v1/me`);

      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      console.log("fetch user error: ", error);

      setUser(null);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  async function logoutUser(navigate) {
    try {
      const { data } = await api.post("/api/v1/logout");
      toast.success(data.message);
      setIsAuth(false);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log("logout error: ", error);
      toast.error("Somthing went wrong");
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        setIsAuth,
        isAuth,
        user,
        setUser,
        loading,
        fetchUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const AppData = () => {
  const context = useContext(AppContext);

  if (!context) throw new Error("AppData must be used within an Appprovider.");
  return context;
};
