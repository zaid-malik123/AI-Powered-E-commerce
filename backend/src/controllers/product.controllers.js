import Product from "../models/product.model.js";
import { uploadImage } from "../services/imageKit.service.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, category, price, sizes, subCategory } = req.body;
    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadImage(req.file);
      imageUrl = uploadedImage.url;
    }

    const product = await Product.create({
      name,
      description,
      category,
      subCategory,
      price,
      sizes,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({createdAt: -1}).limit(30)

    return res.status(200).json(products)

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export const filterProducts = async (req, res) => {
  try {
    const { category, subCategory } = req.body;

    const filter = {};

    if (category && category.length > 0) {
      filter.category = { $in: category };
    }

    if (subCategory && subCategory.length > 0) {
      filter.subCategory = { $in: subCategory };
    }

    const products = await Product.find(filter).sort({createdAt: -1});

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Filter error",
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Product id required" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(5);

    res.status(200).json({
      success: true,
      relatedProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q, price } = req.query;

    if (!q && !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide search query or price",
      });
    }

    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (price) {
      filter.price = { $lte: Number(price) };
    }

    const products = await Product.find(filter).limit(20);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


