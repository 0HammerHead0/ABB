import React, { useState, useEffect } from "react";
import axios from "axios";

export function MyBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("genixToken");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/bids/user-bids", {
          headers: { authorization: token },
        });
        setBids(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [token]);

  const truncateDescription = (description, maxLength) => {
    return description.length > maxLength ? description.substring(0, maxLength) + "..." : description;
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error fetching bids.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Bids</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bids.map((bid,index) => (
          <div key={bid._id} className="rounded-lg shadow-md p-4 bg-gray-200">
            <h2 className="text-xl font-bold mb-2">{index+1}. {bid.auctionItem.title}</h2>
            <p className="text-gray-700 mb-2">
              {truncateDescription(bid.auctionItem.description, 50)}
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 mb-2">Bid Amount: ${bid.amount}</p>
              <p className="text-gray-500 mb-2">Current Highest Bid: ${bid.auctionItem.currentHighestBid}</p>
              <p className="text-gray-500 mb-2">End Date: {new Date(bid.auctionItem.endDate).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
