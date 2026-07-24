import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loading = () => {
  const navigate = useNavigate();
  const { fetchUser } = useAppContext();

  useEffect(() => {
    const timeout = setTimeout(async () => {
      // Give the Stripe webhook a moment to land, then refresh credits
      if (fetchUser) await fetchUser();
      navigate("/", { replace: true });
    }, 2000);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <div className="bg-gradient-to-b from-[#531B81] to-[#29184B] flex flex-col items-center justify-center h-screen w-screen">
      <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin"></div>

      <p className="text-white mt-4 text-sm tracking-wide">Loading...</p>
    </div>
  );
};

export default Loading;
