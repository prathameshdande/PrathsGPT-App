import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  // Keep axios' default headers in sync with the current token so every
  // request automatically carries the right "Authorization: Bearer <token>" header.
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message || "Failed to fetch user data");
        setToken(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setToken(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const createNewChat = async () => {
    try {
      if (!user) return toast("Login to create a new chat");
      const { data } = await axios.get("/api/chat/create");
      if (!data.success) {
        toast.error(data.message || "Failed to create a new chat");
        return false;
      }
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  const fetchUsersChat = async () => {
    try {
      const { data } = await axios.get("/api/chat/get");

      if (data.success) {
        if (data.chats.length === 0) {
          const created = await createNewChat();
          if (created) {
            const retry = await axios.get("/api/chat/get");
            if (retry.data.success) {
              setChats(retry.data.chats);
              setSelectedChat(retry.data.chats[0] || null);
            }
          }
          return;
        }

        setChats(data.chats);
        // Only set selectedChat if none is selected yet
        setSelectedChat((prev) => {
          if (prev) {
            // Keep current selection but update its data from DB
            const updated = data.chats.find((c) => c._id === prev._id);
            return updated || data.chats[0];
          }
          // First load — select the first chat
          return data.chats[0];
        });
      } else {
        toast.error(data.message || "Failed to fetch chats");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const { data } = await axios.post("/api/chat/delete", { chatId });
      if (data.success) {
        toast.success(data.message || "Chat deleted");
        const remaining = chats.filter((c) => c._id !== chatId);
        setChats(remaining);
        if (selectedChat?._id === chatId) {
          setSelectedChat(remaining[0] || null);
        }
        if (remaining.length === 0) {
          await fetchUsersChat();
        }
      } else {
        toast.error(data.message || "Failed to delete chat");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setChats([]);
    setSelectedChat(null);
    toast.success("Logged out successfully");
  };

  useEffect(() => {
    const syncUser = async () => {
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }

      await fetchUser();
    };

    syncUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (user) {
      fetchUsersChat();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // DARK / LIGHT THEME
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    html.style.minHeight = "100%";
    body.style.minHeight = "100vh";
    body.style.margin = "0";

    if (theme === "dark") {
      html.classList.add("dark");

      body.style.background = `
        radial-gradient(circle at top center, rgba(147,51,234,0.25), transparent 30%),
        linear-gradient(to bottom, #0f0f0f, #000000 60%)
      `;

      body.style.backgroundAttachment = "fixed";
      body.style.backgroundRepeat = "no-repeat";
      body.style.backgroundSize = "cover";
      body.style.color = "#ffffff";
    } else {
      html.classList.remove("dark");

      body.style.background = "#ffffff";
      body.style.color = "#000000";
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = {
    navigate,
    user,
    setUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    createNewChat,
    deleteChat,
    logout,
    loadingUser,
    fetchUsersChat,
    fetchUser,
    token,
    setToken,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
