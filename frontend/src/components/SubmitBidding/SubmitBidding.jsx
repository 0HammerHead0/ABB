import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";

export function SubmitBidding({onClose}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("Loading...");
  const [bidSuccessful, setBidSuccessful] = useState(false);
  async function fetchProduct() {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/auction-items/${id}`
      );
      setProduct(response.data);
      setTimeRemaining(formatTimeRemaining(response.data.endDate));
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchProduct();
  }, [id]);

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

  function handleClose() {
    onClose();
    fetchProduct();
  }
  function submitBid() {
    const bid = document.getElementById("bid").value;
    if (bid < product.currentHighestBid) {
      alert("Your bid is lower than the current bid. Please try again.");
      return;
    }
    axios
      .post(`http://localhost:3001/api/bids`, {
        amount: bid,
        auctionItem: id,
      },{
        headers: {
          authorization: window.localStorage.getItem("genixToken"),
        },
      })
      .then((res) => {
        if (res.status === 201 ){
          setBidSuccessful(true);
        } else {
          alert("Failed to submit bid. Please try again.");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to submit bid. Please try again.");
      });
  }
  if (!product) return <div>Loading...</div>;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur bg-white bg-opacity-30">
      <div className="relative flex justify-center items-center w-[520px] h-auto m-auto shadow-lg flex-col p-6 rounded-lg bg-white backdrop-blur-xl">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={handleClose}
        >
          &times;
        </button>
          <div className="flex justify-center items-center border-b-2 border-gray-300 w-full pb-2 mb-4">
            <h1 className="font-manrope font-bold text-[24px]">Submit Bid</h1>
            <span className="mx-2 text-[24px]">|</span>
            <p className="font-manrope font-normal text-[14px]">{product.title}</p>
          </div>
        {!bidSuccessful ? (
          <>
            <div className="flex flex-col w-full">
              <label className="font-manrope font-bold text-[16px]">Straight bid</label>
              <input
                type="number"
                id =  "bid"
                className="border-2 border-gray-300 rounded-md p-2 my-2"
                placeholder="Enter your bid"
              />
              <label className="font-manrope font-bold text-[16px]">Maximum bid</label>
              <input
                type="number"
                disabled
                className="border-2 border-gray-300 rounded-md p-2 my-2"
                placeholder="Enter your bid"
              />
            </div>
            <div className="flex flex-col w-full gap-2 mt-4">
              <div className="flex justify-between items-center">
                <h1 className="text-[16px]">Minimum Bid</h1>
                <h1 className="font-bold text-[24px]">${product.startingBid}</h1>
              </div>
              <div className="flex justify-between items-center">
                <h1 className="text-[16px]">Current Bid</h1>
                <h1 className="font-bold text-[24px]">${product.currentHighestBid}</h1>
              </div>
            </div>
            <h1 className="my-4 font-manrope text-[16px]">{timeRemaining}</h1>
            <div className="flex justify-end w-full">
              <button onClick={submitBid} className="bg-blue-500 text-white font-manrope p-2 rounded-md">
                Submit &gt;
              </button>
            </div>
          </>
        ):
        (<>
          <img src="../../submitBid.svg" alt="Bid Successful" className="w-auto h-auto py-8"/>
        </>)
        }

      </div>
    </div>,
    document.getElementById("portal-root")
  );
}
