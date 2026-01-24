import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Men", "Women", "Kids"],
      default: "Men",
    },

    subCategory: {
      type: String,
      enum: ["Topwear", "Bottomwear", "Winterwear"],
      default: "Topwear",
    },

    price: {
      type: String, 
      required: true,
    },

    sizes: {
      type: String, 
      enum: ["S", "M", "L", "XL", "XXL"],
    },

    image: {
      type: String, 
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
