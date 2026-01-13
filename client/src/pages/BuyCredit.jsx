import React, { useContext, useState } from 'react';
import { assets, plans } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

const BuyCredit = () => {
  const { user, backendUrl, token, setShowLogin, loadCreditsData } =
    useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initPay = (order) => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded');
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Credits Payment',
      description: 'Credits Payment',
      order_id: order.id,
      receipt: order.receipt,

      handler: async (response) => {
  try {
    // 🔐 Verify payment
    await axios.post(
      backendUrl + "/users/verify-razor",
      response,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success("Payment successful! Credits added 🎉");

    // Reload credits
    await loadCreditsData();

    // ✅ Redirect to Home after short delay (better UX)
    setTimeout(() => {
      navigate("/");
    }, 1200);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Payment verification failed"
    );
  }
},

      theme: {
        color: '#1f2937',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    if (loading) return;

    try {
      if (!user) {
        toast.error('Please login to purchase credits');
        setShowLogin(true);
        return;
      }

      setLoading(true);

      const { data } = await axios.post(
        backendUrl + '/users/pay-razor',
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message || 'Payment initialization failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] justify-center text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>

      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Select the plan
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item, index) => (
          <div
            key={index}
            className="inline-block border border-gray-400 rounded-lg m-4 p-6 w-72 hover:scale-105 transition-all"
          >
            <img width={40} src={assets.logo_icon} alt="" />

            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>

            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price}</span> /{' '}
              {item.credits} credits
            </p>

            <button
              disabled={loading}
              onClick={() => paymentRazorpay(item.id)}
              className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 disabled:opacity-60"
            >
              {loading
                ? 'Processing...'
                : user
                ? 'Purchase'
                : 'Login to continue'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredit;
