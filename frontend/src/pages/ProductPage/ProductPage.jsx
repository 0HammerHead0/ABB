import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../../components/Navbar/Navbar";
import { SubmitBidding } from "../../components/SubmitBidding/SubmitBidding";

export function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("Loading...");
  const [bids, setBids] = useState([]);
  const [bidders, setBidders] = useState([]);
  const [selfBid, setSelfBid] = useState(null);
  const [uniqueBidders, setUniqueBidders] = useState([]);
  const { loggedIn, user } = location.state || {};
  const [ submitBid, setSubmitBid ] = useState(false);
  async function fetchProduct() {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/auction-items/${id}`
      );
      setProduct(response.data);
      setTimeRemaining(formatTimeRemaining(response.data.endDate));

      const bidsResponse = await axios.get(
        `http://localhost:3001/api/bids/auction-item/${id}`
      );
      const bidsData = bidsResponse.data;

      // Map to track the highest bid for each bidder
      const bidderMap = new Map();
      bidsData.forEach((bid) => {
        const bidder = bid.bidder;
        if (
          !bidderMap.has(bidder._id) ||
          bidderMap.get(bidder._id).amount < bid.amount
        ) {
          bidderMap.set(bidder._id, { ...bidder, amount: bid.amount });
        }
      });

      // Convert map to array and sort to place the self user at the top
      let sortedBidders = Array.from(bidderMap.values());
      if (user?._id) {
        const selfBidderIndex = sortedBidders.findIndex(
          (bidder) => bidder._id === user._id
        );
        if (selfBidderIndex !== -1) {
          const selfBidder = sortedBidders.splice(selfBidderIndex, 1)[0];
          sortedBidders = [selfBidder, ...sortedBidders];
          setSelfBid(selfBidder.amount);
        }
      }

      setUniqueBidders(sortedBidders);
      setBids(sortedBidders.map((bidder) => bidder.amount));
      setBidders(sortedBidders);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }
  useEffect(() => {
    fetchProduct();
  }, [id, user]);

  useEffect(() => {
    if (!submitBid) {
      fetchProduct();
    }
  }, [submitBid]);
  useEffect(() => {
    if (product) {
      const interval = setInterval(() => {
        setTimeRemaining(formatTimeRemaining(product.endDate));
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [product]);

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

  if (!product) return <div>Loading...</div>;
  function handleCardClick() {
    setSubmitBid(true);
    // navigate(`/submitBid/${product._id}`, {
    //   state: { loggedIn, user },
    // });

  }
  return (
    <div className="w-full flex items-center justify-center flex-col">
      <div className="flex flex-col items-center">
        <Navbar
          relPath={"../../"}
          className="fixed"
          loggedIn={loggedIn}
          user={user}
        />
      </div>
      <div className="w-[80%] flex flex-row font-manrope">
        <div className=" p-3 mt-5">
          <div onClick={() => navigate("/")}  className="flex flex-row w-full text-blue-700 font-semibold mb-4 items-center cursor-pointer">
            <svg
              className="mr-4"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="20" height="20" fill="#1D4ED8" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.0894 5.24408C12.764 4.91864 12.2363 4.91864 11.9109 5.24408L7.74424 9.41074C7.4188 9.73618 7.4188 10.2638 7.74424 10.5893L11.9109 14.7559C12.2363 15.0814 12.764 15.0814 13.0894 14.7559C13.4149 14.4305 13.4149 13.9028 13.0894 13.5774L9.51201 10L13.0894 6.42259C13.4149 6.09715 13.4149 5.56951 13.0894 5.24408Z"
                fill="white"
              />
            </svg>
            <strong>
              <p>Back to catalog</p>
            </strong>
          </div>
          <img
            src="../../Headphone.svg"
            className="rounded w-full"
            alt="Auction Item"
          />
          <h1 className="text-white bg-emerald-600 w-fit rounded text-nowrap my-2 px-2 py-1 mt-8 text-[12px]">
            Live Auction
          </h1>
          <h1 className="font-manrope font-bold text-[16px] text-nowrap">
            {product.title}
          </h1>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between mt-2 items-center">
              <h1 className="text-[16px]">Minimum Bid</h1>
              <h1 className="font-bold text-[24px]">${product.startingBid}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-[16px]">Current Bid</h1>
              <h1 className="font-bold text-[24px]">
                ${product.currentHighestBid}
              </h1>
            </div>
          </div>
          <h1 className="my-4">{timeRemaining}</h1>
        </div>
        <div className="w-[60%] p-8">
          <h1 className="font-manrope font-semibold tex-[16px] mb-3">
            Description
          </h1>
          <p className="text-[16px] font-manrope-normal">
            {product.description}
          </p>
          <h1 className="font-manrope font-bold text-[16px] my-2">Reviews</h1>
          <img
            src="../../comment.svg"
            alt="Product Image"
            className="w-full mt-5"
          />
        </div>
        <div className="w-[350px] p-3 mt-5">
          {selfBid == null && (
            <p className="mb-6 font-semibold">No bids placed yet</p>
          )}
          <ul className="list-disc pt-5">
            {selfBid !== null && (
              <li className="flex justify-start items-center text-[16px] font-bold mb-2">
                {user.firstName} &nbsp;bids&nbsp; <strong>${selfBid}</strong>
              </li>
            )}
            {uniqueBidders.map(
              (bidder) =>
                bidder._id !== user._id && (
                  <li
                    key={bidder._id}
                    className="flex justify-start items-center text-[16px] mb-2"
                  >
                    <p className="">
                      {bidder.firstName} &nbsp;bids&nbsp;{" "}
                      <strong>${bidder.amount}</strong>
                    </p>
                  </li>
                )
            )}
          </ul>
          <button
            className="flex items-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded w-full justify-center bg-blue-gradient-button"
            onClick={handleCardClick}
          >
            <span className="text-nowrap">Bid Now</span>
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
      </div>
      {submitBid && (
        <div className="fixed top-0 left-0 w-fit h-fit">
          <SubmitBidding onClose={() => setSubmitBid(false)} />
        </div>
      )}

    </div>
  );
}
