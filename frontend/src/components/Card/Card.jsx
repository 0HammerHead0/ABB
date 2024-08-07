import React, { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export function Card({ card, user, loggedIn }) {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(
    formatTimeRemaining(card.endDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(card.endDate));
    }, 60000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [card.endDate]);

  function formatTimeRemaining(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) {
      return "Ended";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    let timeString = "Ends in: ";
    if (days > 0) {
      timeString += `${days} day${days > 1 ? "s" : ""} `;
    }
    if (hours > 0) {
      timeString += `${hours} hr${hours > 1 ? "s" : ""} `;
    }
    if (minutes > 0) {
      timeString += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    return timeString.trim();
  }
  function handleCardClick() {
    navigate(`/product/${card._id}`,{
      state: { loggedIn, user }
    }); // Navigate to the product description page
  }
  return (
    <div className="shadow-xl p-3" onClick={handleCardClick}>
      <img src="Headphone.svg" className="rounded w-full" alt="Auction Item" />
      <h1 className="text-white bg-emerald-600 w-fit rounded text-nowrap my-2 px-2 py-1">
        Live Auction
      </h1>
      <h1 className="font-manrope font-bold text-[16px] text-nowrap">
        {card.title}
      </h1>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between mt-2 items-center">
          <h1 className="text-[16px]">Minimum Bid</h1>
          <h1 className="font-bold text-[24px]">${card.startingBid}</h1>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-[16px]">Current Bid</h1>
          <h1 className="font-bold text-[24px]">${card.currentHighestBid}</h1>
        </div>
      </div>
      <h1 className="my-4">{timeRemaining}</h1>
      <button className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded w-full justify-center bg-red-blue-gradient-button">
        <span>Bid Now</span>
        <svg
          className="w-4 h-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 7l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
