import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets.js";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const fetchUser = async () => {
    setUser(dummyUserData);
  };

  const fetchUsersChat = async () => {
    setChats(dummyChats);
    setSelectedChat(dummyChats[0]);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUsersChat();
    } else {
      setChats([]);
      setSelectedChat(null);
    }
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
