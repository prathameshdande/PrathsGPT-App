import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Message from "./Message";

const ChatBox = () => {
  const { selectedChat, theme } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const containerRef = useRef(null);

  // SUBMIT
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim()) return;

    const newMessage = {
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setPrompt("");

    // Loading
    setLoading(true);

    // Dummy AI Reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            mode === "image"
              ? "🖼️ Image generated successfully!"
              : "✨ Hello! How can I help you?",
          timestamp: new Date(),
        },
      ]);

      setLoading(false);
    }, 1000);
  };

  // LOAD SELECTED CHAT
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat?.messages || []);
    }
  }, [selectedChat]);

  // AUTO SCROLL
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  return (
    <div
      className="
      flex-1 flex flex-col justify-between
      px-3 sm:px-5 md:px-8 lg:px-10
      pt-16 md:pt-8
      pb-4
      h-screen
      overflow-hidden
      "
    >
      {/* CHAT AREA */}
      <div
        ref={containerRef}
        className="
        flex-1 overflow-y-auto
        pr-1 pb-4
        scrollbar-thin
        scrollbar-thumb-gray-300
        dark:scrollbar-thumb-[#4E3B6E]
        "
      >
        {/* EMPTY STATE */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-primary">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt="logo"
              className="w-full max-w-52 sm:max-w-64 opacity-90"
            />

            <p
              className="
              mt-4 text-3xl sm:text-5xl
              text-center
              text-gray-400 dark:text-white
              font-semibold
              "
            >
              Ask me anything...!
            </p>

            <span className="text-sm text-gray-400 dark:text-gray-500">
              AI Assistant Ready 🚀
            </span>
          </div>
        )}

        {/* MESSAGES */}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* LOADING */}
        {loading && (
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"></div>

            <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]"></div>

            <div className="w-2 h-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0.4s]"></div>
          </div>
        )}
      </div>

      {/* IMAGE MODE CHECKBOX */}
      {mode === "image" && (
        <label
          className="
          inline-flex items-center gap-3
          mb-3 mt-2
          text-sm mx-auto
          px-4 py-2
          rounded-full
          bg-white dark:bg-[#241B35]
          border border-gray-200 dark:border-[#57317C]
          shadow-sm
          "
        >
          <input
            type="checkbox"
            className="
            cursor-pointer
            w-4 h-4
            accent-violet-600
            "
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />

          <p className="text-xs text-gray-600 dark:text-gray-300">
            Publish Generated Image to Community
          </p>
        </label>
      )}

      {/* INPUT BOX */}
      <form
        onSubmit={onSubmit}
        className="
        bg-primary/20 dark:bg-[#583C79]/30
        border border-primary dark:border-[#80609F]/30
        rounded-full
        w-full max-w-3xl
        p-2.5 pl-4 pr-3
        mx-auto
        flex items-center gap-3
        backdrop-blur-md
        shadow-lg
        "
      >
        {/* SELECT */}
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="
          text-sm
          bg-transparent
          outline-none
          text-gray-700 dark:text-gray-200
          "
        >
          <option className="bg-purple-900" value="text">
            Text
          </option>

          <option className="bg-purple-900" value="image">
            Image
          </option>
        </select>

        {/* INPUT */}
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          type="text"
          placeholder={
            mode === "image"
              ? "Describe your image..."
              : "Type your prompt here..."
          }
          className="
          flex-1 w-full
          bg-transparent
          text-sm sm:text-base
          outline-none
          text-gray-700 dark:text-white
          placeholder-gray-400
          "
          required
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="
          w-10 h-10
          rounded-full
          flex items-center justify-center
          bg-gradient-to-r from-violet-500 to-purple-600
          hover:scale-105
          transition-all duration-200
          shadow-md
          "
        >
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            className="w-5 h-5"
            alt="send"
          />
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
