import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Loading from "./Loading";
import { useAppContext } from "../context/AppContext";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);
  const { axios, user } = useAppContext();

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get("/api/credit/plan");
      if (data.success) {
        setPlans(data.plans);
      } else {
        toast.error(data.message || "Failed to load plans");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (planId) => {
    if (!user) return toast.error("Please login to buy credits");
    setPurchasingId(planId);
    try {
      const { data } = await axios.post("/api/credit/purchase", { planId });
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Purchase failed");
    } finally {
      setPurchasingId(null);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-scroll mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-2 xl:mt-30 text-gray-800 dark:text-white">
        Credit Plans
      </h2>
      <p className="text-center text-sm text-gray-500 dark:text-purple-200/70 mb-10">
        Choose a plan that fits how much you chat and create.
      </p>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`border border-gray-200 dark:border-purple-700 rounded-lg shadow hover:shadow-lg transition-shadow p-6 min-w-[300px] flex flex-col ${plan._id === "pro" ? "bg-purple-50 dark:bg-purple-900" : "bg-white dark:bg-transparent"}`}
          >
            <div className="flex-1 ">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 ">
                {plan.name}
              </h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-300 mb-4">
                ${plan.price}
                <span className=" text-base font-normal text-gray-600 dark:text-purple-200 ">
                  {" "}
                  / {plan.credits} credits
                </span>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-purple-200 space-y-1 ">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleBuy(plan._id)}
              disabled={purchasingId === plan._id}
              className="mt-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2 rounded transition-colors cursor-pointer "
            >
              {purchasingId === plan._id ? "Redirecting..." : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
