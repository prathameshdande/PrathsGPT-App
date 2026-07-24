import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";

const Login = () => {
  const [state, setState] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { axios, setToken } = useAppContext();

  const isRegister = state === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (isRegister && name.trim().length < 2) {
      return toast.error("Please enter your full name");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const url = isRegister ? "/api/user/register" : "/api/user/login";

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(url, { name, email, password });
      if (data.success) {
        toast.success(isRegister ? "Account created! Welcome 🎉" : "Welcome back 👋");
        setToken(data.token);
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "An error occurred during authentication",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-[#0b0b0f]">
      {/* LEFT — BRAND / HERO PANEL */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden px-14 py-12 bg-gradient-to-br from-[#2a1750] via-[#3d1f6e] to-[#0b0b0f]">
        {/* ambient glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />

        <img
          src={assets.logo_full}
          alt="PrathsGPT"
          className="relative w-40 object-contain"
        />

        <div className="relative flex flex-col items-center text-center gap-8">
          <img
            src={assets.hero}
            alt=""
            className="w-64 drop-shadow-[0_20px_45px_rgba(168,85,247,0.35)]"
          />
          <div>
            <h1 className="text-3xl xl:text-4xl font-semibold text-white leading-tight">
              Your ideas,<br />amplified by AI.
            </h1>
            <p className="mt-4 text-sm text-violet-200/70 max-w-sm mx-auto">
              Chat, brainstorm, and generate images in one place. Sign in to
              pick up right where you left off.
            </p>
          </div>
        </div>

        <ul className="relative flex flex-col gap-3 text-sm text-violet-100/80">
          {[
            "Unlimited text conversations",
            "AI image generation with credits",
            "Your chat history, synced everywhere",
          ].map((line) => (
            <li key={line} className="flex items-center gap-3">
              <span className="w-5 h-5 shrink-0 rounded-full bg-violet-500/20 border border-violet-400/40 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-300" />
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* RIGHT — AUTH FORM PANEL */}
      <div className="relative flex items-center justify-center px-6 py-16 bg-[#0b0b0f]">
        <div className="pointer-events-none absolute inset-0 lg:hidden bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.18),transparent_55%)]" />

        <div className="relative w-full max-w-sm">
          {/* mobile logo */}
          <img
            src={assets.logo_full}
            alt="PrathsGPT"
            className="w-32 mx-auto mb-8 lg:hidden"
          />

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 backdrop-blur-xl p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-semibold text-white">
                {isRegister ? "Create your account" : "Welcome back"}
              </h2>
              <p className="mt-1 text-sm text-white/50">
                {isRegister
                  ? "Start chatting with AI in under a minute."
                  : "Sign in to continue to PrathsGPT."}
              </p>
            </div>

            {/* tab switch */}
            <div className="grid grid-cols-2 mb-7 p-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
              {["login", "register"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setState(tab)}
                  className={`py-2 rounded-full transition-all cursor-pointer ${
                    state === tab
                      ? "bg-gradient-to-r from-[#A457F7] to-[#3D81F6] text-white shadow-md"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {tab === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {isRegister && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-white/60">
                    Full name
                  </label>
                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 focus-within:border-violet-400/60 transition-colors">
                    <img
                      src={assets.user_icon}
                      alt=""
                      className="w-4 h-4 opacity-60 invert"
                    />
                    <input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      placeholder="Jane Doe"
                      className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                      type="text"
                      autoComplete="name"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-white/60">
                  Email address
                </label>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 focus-within:border-violet-400/60 transition-colors">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white/40 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6.75A2.25 2.25 0 0 1 5.25 4.5h13.5A2.25 2.25 0 0 1 21 6.75v10.5A2.25 2.25 0 0 1 18.75 19.5H5.25A2.25 2.25 0 0 1 3 17.25V6.75Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m3.5 7 8.5 6 8.5-6"
                    />
                  </svg>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-white/60">
                    Password
                  </label>
                  {!isRegister && (
                    <span className="text-xs text-violet-300/70 cursor-not-allowed select-none">
                      Forgot password?
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 focus-within:border-violet-400/60 transition-colors">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 text-white/40 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V7.5a4.5 4.5 0 1 0-9 0v3M6 10.5h12A1.5 1.5 0 0 1 19.5 12v7A1.5 1.5 0 0 1 18 20.5H6A1.5 1.5 0 0 1 4.5 19v-7A1.5 1.5 0 0 1 6 10.5Z"
                    />
                  </svg>
                  <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="••••••••"
                    className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.774 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
                {isRegister && (
                  <p className="text-[11px] text-white/35">Use at least 6 characters.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#A457F7] to-[#3D81F6] hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all text-white text-sm font-medium w-full py-2.5 rounded-lg cursor-pointer shadow-lg shadow-violet-900/30"
              >
                {isSubmitting && (
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                )}
                {isSubmitting
                  ? "Please wait..."
                  : isRegister
                    ? "Create account"
                    : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-white/50">
              {isRegister ? "Already have an account?" : "New to PrathsGPT?"}{" "}
              <button
                type="button"
                onClick={() => setState(isRegister ? "login" : "register")}
                className="text-violet-300 hover:text-violet-200 font-medium cursor-pointer"
              >
                {isRegister ? "Sign in" : "Create one"}
              </button>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-white/25">
            By continuing you agree to PrathsGPT's Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
