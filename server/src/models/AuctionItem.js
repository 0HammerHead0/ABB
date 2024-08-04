import mongoose from 'mongoose';

const AuctionItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startingBid: {
      type: Number,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    currentHighestBid: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bids: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
      },
    ],
  },
  { timestamps: true }
);

export const AuctionItemModel = mongoose.model('AuctionItem', AuctionItemSchema);
