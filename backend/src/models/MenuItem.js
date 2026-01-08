import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "ETB",
    },

    category: {
      type: String, //main, breakfast, fasting...
    },
    image: {
      type: String,
    },

    rating: {
      average: {
        type: Number,
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

menuItemsSchema.index({ business: 1, category: 1 });
menuItemsSchema.index({ business: 1, isPopular: -1 });

export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
