import Product from "../models/product.model.js";
import { uploadImage } from "../services/imageKit.service.js";
import { generateVector } from "../config/createVector.js";
import { index } from "../services/pincone.service.js";

export const createProductController = async (req, res) => {
  try {
    let { name, description, category, price, sizes, subCategory } = req.body;

    if (typeof sizes === "string") {
      sizes = JSON.parse(sizes);
    }

    const imageUrls = req.files?.length
      ? (await Promise.all(req.files.map((file) => uploadImage(file)))).map(
          (img) => img.url,
        )
      : [];

    const product = await Product.create({
      name,
      description,
      category,
      subCategory,
      price,
      sizes,
      image: imageUrls,
    });
    const text = `
    Product: ${product.name}
    Category: ${product.category}
    Subcategory: ${product.subCategory}
    Description: ${product.description}
    `;

    const vectors = await generateVector(text);

    const record = [
      {
        id: product._id.toString(),
        values: vectors,
        metadata: {
          name: product.name,
          category: product.category,
          subCategory: product.subCategory,
          description: product.description,
        },
      },
    ];
    await index.upsert({
      records: record,
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
    const products = await Product.find({}).sort({ createdAt: -1 });

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, subCategory, q, page = 1, limit = 30, minPrice, maxPrice } = req.query;

    const filter = {};

    // Category filter
    if (category) {
      filter.category = { $in: category.split(",") };
    }

    // Subcategory filter
    if (subCategory) {
      filter.subCategory = { $in: subCategory.split(",") };
    }

    // Search filter
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // 💰 Price filter (IMPORTANT PART)
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      products,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
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

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting product",
    });
  }
};

export const latestCollection = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(10);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Latest Collection Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching latest products",
    });
  }
};

export const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await Product.find().sort({ totalSold: -1 }).limit(5);

    res.status(200).json({
      success: true,
      products: bestSellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching best sellers",
    });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const text = `
    Product: ${product.name}
    Category: ${product.category}
    Subcategory: ${product.subCategory}
    Description: ${product.description}
    `;

    const createVector = await generateVector(text);

    // console.log(createVector)

    const result = await index.query({
      vector: createVector,
      topK: 5,
      includeMetadata: false,
    });

    const ids = result.matches.map((item) => item.id);

    const relatedProducts = await Product.find({
      _id: { $in: ids, $ne: id },
    });
    const productMap = {};

    relatedProducts.forEach((p) => {
      productMap[p._id.toString()] = p;
    });

    const orderedProducts = ids
      .map((id) => productMap[id])
      .filter(Boolean);
    return res.status(200).json({
      success: true,
      relatedProducts: orderedProducts,
    });
    // const relatedProducts = await Product.find({
    //   _id: { $ne: id },
    //   category: product.category,
    //   subCategory: product.subCategory,
    // }).limit(5);

    // return res.status(200).json({
    //   success: true,
    //   relatedProducts,
    // });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// export const testPinecone = async (req, res) => {
//   try {

//     const vector = Array.from({ length: 768 }, () => Math.random());

//     const record = [
//       {
//         id: "12345",
//         values: vector,
//         metadata: { name: "test product" }
//       }
//     ]

//     const response = await index.upsert({
//       records: record
//     });

//     console.log(response);

//     res.json({
//       success: true,
//       response
//     });

//   } catch (error) {
//     console.error(error);
//   }
// };
