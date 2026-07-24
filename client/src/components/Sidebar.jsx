import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import moment from "moment";

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme,
    user,
    navigate,
    createNewChat,
    fetchUsersChat,
    deleteChat,
    logout,
  } = useAppContext();
  const [search, setSearch] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.messages[0]
      ? chat.messages[0].content.toLowerCase().includes(search.toLowerCase())
      : chat.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div
        className={`flex flex-col h-screen w-72 p-5
      dark:bg-linear-to-b from-[#242124]/30 to-[#000000]/30
      border-r border-[#80609f]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-1 ${!isMenuOpen && "max-md:-translate-x-full"}`}
      >
        {/* Top Section */}
        <div className="flex flex-col gap-3 mx=5">
          <img
            src={theme === "dark" ? assets.logo_full_dark : assets.logo_full}
            alt="Logo"
            className="h-8 w-fit object-contain"
          />

          <button
            onClick={async () => {
              navigate("/");
              const created = await createNewChat();
              if (created) await fetchUsersChat();
              setIsMenuOpen(false);
            }}
            className="flex justify-center items-center w-full py-2 text-white
          bg-gradient-to-r from-[#A457F7] to-[#3D81F6]
          text-sm rounded-md cursor-pointer hover:opacity-90 transition"
          >
            <span className="mr-2 text-xl">+</span>
            New Chat
          </button>

          <div className="flex items-center gap-2 p-3 border border-gray-400 dark:border-white/20 rounded-md">
            <img
              src={assets.search_icon}
              alt="search"
              className="w-4 not-dark:invert"
            />

            <input
              type="text"
              placeholder="Search conversations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {chats.length > 0 && (
          <p className="mt-5 text-sm font-medium">Recent Chats</p>
        )}

        <div className="flex-1 overflow-y-auto mt-3 text-sm space-y-3 pr-1">
          {filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => {
                navigate("/");
                setSelectedChat(chat);
                setIsMenuOpen(false);
              }}
              className={`p-3 px-4 border rounded-md cursor-pointer
            flex justify-between items-center group transition
            ${
              selectedChat?._id === chat._id
                ? "bg-violet-500/10 border-violet-400/40"
                : "dark:bg-[#57317C]/10 border-gray-300 dark:border-[#80609F]/15 hover:bg-gray-100 dark:hover:bg-[#57317C]/20"
            }`}
            >
              <div className="flex-1 overflow-hidden">
                <p className="truncate">
                  {chat.messages.length > 0
                    ? chat.messages[0].content.slice(0, 32)
                    : chat.name}
                </p>

                <p className="text-xs text-gray-500 dark:text-[#B1A6C0] mt-1">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              <img
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Delete this chat?")) {
                    deleteChat(chat._id);
                  }
                }}
                src={assets.bin_icon}
                alt="Delete"
                className="hidden group-hover:block w-4 ml-2 cursor-pointer not-dark:invert"
              />
            </div>
          ))}
        </div>

        <div
          onClick={() => {
            navigate("/community");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
        >
          <img
            src={assets.gallery_icon}
            className="w-4.5 not-dark:invert"
            alt=""
          />
          <div className="flex flex-col text:sm">
            <p>Community Images</p>
          </div>
        </div>

        <div
          onClick={() => {
            navigate("/credits");
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-103 transition-all"
        >
          <img src={assets.diamond_icon} className="w-4.5 dark:invert" alt="" />
          <div className="flex flex-col text:sm">
            <p>Credits : {user?.credits}</p>
            <p className="text-xs text-gray-400">
              Purchase credits to use PrathsGPT
            </p>
          </div>
        </div>

        {/* ✅ FIXED DARK MODE TOGGLE */}
        <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md ">
          <div className="flex items-center justify-between gap-2 text-sm">
            <img
              src={assets.theme_icon}
              className="w-4 not-dark:invert"
              alt=""
            />
            <p>Dark Mode</p>
          </div>

          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
            />
            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-purple-600 transition-all"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
          </label>
        </div>

        <div className="flex items-center gap-2 p-3 mt-4 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group">
          <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
          <p className="flex-1 text-sm dark:text-primary truncate">
            {user ? user.name : "Login your account"}
          </p>
          {user && (
            <img
              onClick={logout}
              src={assets.logout_icon}
              alt="Logout"
              className="h-5 cursor-pointer hidden not-dark:invert group-hover:block"
            />
          )}
        </div>

        <img
          onClick={() => setIsMenuOpen(false)}
          src={assets.close_icon}
          alt=""
          className="absolute top-3 right-3 w-5 h-5 cursor-pointer md:hidden not-dark:invert"
        />
      </div>
    </div>
  );
};

export default Sidebar;
