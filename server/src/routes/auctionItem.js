import express from 'express';
import { AuctionItemModel } from '../models/AuctionItem.js';
import { verifyToken } from './user.js'; // Import the verifyToken middleware
import jwt from 'jsonwebtoken';
const router = express.Router();

// Create a new auction item
router.post('/', verifyToken, async (req, res) => {
    const { title, description, startingBid, endDate } = req.body;
    const { userId } = req.user; // Assuming userId is set in req.user by verifyToken
  
    try {
      const newAuctionItem = new AuctionItemModel({
        title,
        description,
        startingBid,
        endDate,
        owner: userId,
        currentHighestBid: startingBid,
        bids: [],
      });
  
      await newAuctionItem.save();
      res.status(201).json(newAuctionItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
// get auction item by id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const auctionItem = await AuctionItemModel.findById(id).populate('owner bids');
  
      if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });
  
      res.status(200).json(auctionItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});
// Get all auction items available for specific user
router.get('/user/available-products', async (req, res) => {
  console.log("ENDPOINT")
  console.log(req)
  const token = req.headers.authorization;
  console.log(token)
  let user = null;
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) return res.sendStatus(403);
    user = { userId: decoded._id };
    
  });
  const auctionItems = await AuctionItemModel.find({ owner: {$ne:user.userId} }).populate('owner bids');
  res.status(200).json(auctionItems);
});
// Get all auction items
router.get('/', async (req, res) => {
  try {
    const auctionItems = await AuctionItemModel.find().populate('owner bids');
    res.status(200).json(auctionItems);
  } catch (err) {

    res.status(500).json({ message: err.message });
  }
});

// Update an auction item
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, startingBid, endDate } = req.body;

  try {
    const auctionItem = await AuctionItemModel.findById(id);
    
    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });
    if (auctionItem.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Not authorized' });
    
    auctionItem.title = title || auctionItem.title;
    auctionItem.description = description || auctionItem.description;
    auctionItem.startingBid = startingBid || auctionItem.startingBid;
    auctionItem.endDate = endDate || auctionItem.endDate;
    
    await auctionItem.save();
    res.status(200).json(auctionItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an auction item
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const auctionItem = await AuctionItemModel.findById(id);

    if (!auctionItem) return res.status(404).json({ message: 'Auction item not found' });
    if (auctionItem.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Not authorized' });
    
    await AuctionItemModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Auction item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
