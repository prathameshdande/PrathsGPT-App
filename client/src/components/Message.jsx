import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";

// Prism Theme
import "prismjs/themes/prism-tomorrow.css";

// Prism Languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";

const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message?.content]);

  // Prevent crash (must come after hooks to satisfy rules-of-hooks)
  if (!message) return null;

  return (
    <div className="w-full px-2 sm:px-4">

      {message.role === "user" ? (

        // USER MESSAGE
        <div className="flex justify-end items-end gap-3 my-5">

          {/* MESSAGE BOX */}
          <div
            className="
            relative
            max-w-[85%] sm:max-w-[75%]
            px-5 py-4
            rounded-[24px]
            rounded-br-md
            bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500
            text-white
            shadow-lg shadow-purple-500/20
            backdrop-blur-sm
            transition-all duration-300
            "
          >

            {/* MESSAGE */}
            <p className="text-[15px] leading-7 whitespace-pre-wrap break-words">
              {message.content}
            </p>

            {/* TIME */}
            <span className="block mt-3 text-[11px] text-purple-100 text-right">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>

          {/* USER AVATAR */}
          <img
            src={assets.user_icon}
            alt="user"
            className="
            w-10 h-10
            rounded-full
            border-2 border-violet-400
            shadow-md
            object-cover
            "
          />
        </div>

      ) : (

        // AI MESSAGE
        <div className="flex justify-start items-start gap-3 my-5">

          {/* AI AVATAR */}
          <div
            className="
            w-10 h-10
            rounded-full
            bg-gradient-to-br from-violet-500 to-purple-600
            flex items-center justify-center
            shadow-md
            overflow-hidden
            "
          >
            <img
              src={assets.logo}
              alt="bot"
              className="w-6 h-6 object-contain"
            />
          </div>

          {/* AI MESSAGE BOX */}
          <div
            className="
            relative
            max-w-[85%] sm:max-w-[75%]
            px-5 py-4
            rounded-[24px]
            rounded-tl-md
            bg-white dark:bg-[#241B35]
            border border-gray-200 dark:border-[#4E3B6E]
            shadow-lg dark:shadow-black/20
            backdrop-blur-sm
            transition-all duration-300
            "
          >

            {/* IMAGE MESSAGE */}
            {message.isImages ? (
              <img
                src={message.content}
                alt="message"
                className="
                w-full max-w-md
                rounded-2xl
                border border-gray-200 dark:border-[#4E3B6E]
                "
              />
            ) : (

              /* TEXT MESSAGE */
              <div
                className="
                prose prose-sm sm:prose-base
                dark:prose-invert
                max-w-none
                overflow-x-auto
                text-gray-700 dark:text-gray-200
                leading-7
                "
              >
                <Markdown>
                  {message.content}
                </Markdown>
              </div>
            )}

            {/* TIME */}
            <span className="block mt-3 text-[11px] text-gray-400">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;