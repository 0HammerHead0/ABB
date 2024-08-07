import express from "express";
import { BidModel } from "../models/Bid.js";
import { AuctionItemModel } from "../models/AuctionItem.js";
import { verifyToken } from "./user.js"; // Import the verifyToken middleware
import { UserModel } from "../models/User.js";

const router = express.Router();

// Place a bid
router.post("/", verifyToken, async (req, res) => {
  const { amount, auctionItem } = req.body;
  const { userId } = req.user; // Assuming userId is set in req.user by verifyToken

  try {
    // Check if auction item exists
    const item = await AuctionItemModel.findById(auctionItem);
    if (!item)
      return res.status(404).json({ message: "Auction item not found" });

    // Check if bid is higher than current highest bid
    if (amount <= item.currentHighestBid) {
      return res
        .status(400)
        .json({ message: "Bid must be higher than the current highest bid" });
    }
    //  Check if the owner of the auction should not be able to bid on their own item

    if (item.owner.toString() === userId) {
      return res.status(403).json({
        message: "Owner of the auction item cannot bid on their own item",
      });
    }
    const newBid = new BidModel({
      amount,
      bidder: userId,
      auctionItem,
    });
    await newBid.save();

    // Update the auction item with the new bid
    item.bids.push(newBid._id);
    item.currentHighestBid = amount;
    await item.save();


    res.status(201).json(newBid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bids for an auction item
router.get("/auction-item/:auctionItemId", async (req, res) => {
  const { auctionItemId } = req.params;

  try {
    const bids = await BidModel.find({ auctionItem: auctionItemId }).populate(
      "bidder"
    );
    res.status(200).json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a bid
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const bid = await BidModel.findById(id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });
    if (bid.bidder.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    bid.amount = amount || bid.amount;
    await bid.save();
    res.status(200).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a bid
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const bid = await BidModel.findById(id);
    if (!bid) return res.status(404).json({ message: "Bid not found" });
    if (bid.bidder.toString() !== req.user.userId)
      return res.status(403).json({ message: "Not authorized" });

    await bid.remove();
    res.status(200).json({ message: "Bid deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/user-bids/:userId", async (req, res) => {
  const { userId } = req.params;
    try {
        const user = await UserModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        const bids = await BidModel.find({ bidder: userId }).populate(
        "auctionItem"
        );
        res.status(200).json(bids);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
