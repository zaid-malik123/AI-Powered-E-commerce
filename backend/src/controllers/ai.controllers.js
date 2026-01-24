import Product from "../models/product.model.js";
import User from "../models/user.model.js";

// Simulated AI responses (Replace with actual AI API like OpenAI, Gemini, etc.)
const getAIResponse = async (prompt, type = "text") => {
  // This is a placeholder. In production, integrate with:
  // - OpenAI API
  // - Google Gemini API
  // - Anthropic Claude API
  // - Or any other AI service

  // For now, returning meaningful responses based on type
  const responses = {
    recommendation: `Based on user preferences and browsing history, this product is highly recommended.`,
    analysis: `This product offers excellent value and quality. Customers who bought this also enjoyed similar items in this category.`,
    search: `Smart search results based on your query and AI understanding of product attributes.`,
    chat: `Thank you for your question! I'm here to help. Feel free to ask me about products, categories, or any shopping assistance you need.`,
  };

  return responses[type] || responses.text;
};

// Get AI Recommendations
export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // Get user's purchase history and preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all products
    const allProducts = await Product.find({});

    // Simple recommendation algorithm based on category preferences
    // In production, use machine learning for better recommendations
    const recommendedProducts = allProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);

    res.status(200).json({
      success: true,
      products: recommendedProducts,
      message: "AI recommendations fetched successfully",
    });
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching recommendations",
      error: error.message,
    });
  }
};

// Analyze Product
export const analyzeProduct = async (req, res) => {
  try {
    const { productId, name, price, category } = req.body;

    if (!productId || !name) {
      return res.status(400).json({ message: "Product ID and name required" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Generate AI analysis
    const analysis = {
      summary: `${name} is a premium ${category} item priced at $${price}. This product combines quality and affordability, making it an excellent choice for discerning customers.`,
      highlights: [
        "High-quality materials and craftsmanship",
        "Competitive pricing in its category",
        "Great customer reviews and ratings",
        "Perfect for various occasions",
      ],
      recommendations: `Based on similar products and customer preferences, this item would pair well with complementary products in our collection. Perfect gift option or personal purchase.`,
      priceAnalysis: `At $${price}, this product offers great value compared to market alternatives.`,
      bestFor: "Fashion enthusiasts and quality-conscious shoppers",
    };

    res.status(200).json({
      success: true,
      analysis,
      message: "Product analysis completed",
    });
  } catch (error) {
    console.error("Error in analyzeProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error analyzing product",
      error: error.message,
    });
  }
};

// Smart Search
export const smartSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: "Valid search query required" });
    }

    // Search in product names and descriptions
    const searchResults = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    res.status(200).json({
      success: true,
      products: searchResults,
      query: query,
      count: searchResults.length,
      message: "Smart search completed",
    });
  } catch (error) {
    console.error("Error in smartSearch:", error);
    res.status(500).json({
      success: false,
      message: "Error performing search",
      error: error.message,
    });
  }
};

// Get Search Suggestions
export const searchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: "Valid search query required" });
    }

    // Get unique product names that match the query
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    })
      .select("name")
      .limit(10);

    const suggestions = products.map((p) => p.name);

    // Add category suggestions
    const categoryProducts = await Product.find({
      category: { $regex: query, $options: "i" },
    })
      .select("category")
      .limit(5);

    const categorySuggestions = [
      ...new Set(categoryProducts.map((p) => p.category)),
    ];

    const allSuggestions = [...suggestions, ...categorySuggestions].slice(0, 8);

    res.status(200).json({
      success: true,
      suggestions:
        allSuggestions.length > 0
          ? allSuggestions
          : [
              `Search: ${query}`,
              `${query} in Men's`,
              `${query} in Women's`,
            ],
      message: "Suggestions fetched successfully",
    });
  } catch (error) {
    console.error("Error in searchSuggestions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
      error: error.message,
    });
  }
};

// Chat with AI
export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Process the message and generate response
    let reply = "";

    const lowerMessage = message.toLowerCase();

    // Handle different types of queries
    if (
      lowerMessage.includes("product") ||
      lowerMessage.includes("item") ||
      lowerMessage.includes("collection")
    ) {
      const products = await Product.find({}).limit(5);
      reply = `I found ${products.length} products in our collection! Would you like me to help you find something specific? I can search by category, price range, or other preferences.`;
    } else if (
      lowerMessage.includes("price") ||
      lowerMessage.includes("cost") ||
      lowerMessage.includes("expensive")
    ) {
      reply =
        "We offer a wide range of products at various price points. What's your budget, and what type of product are you looking for? I'd be happy to find options that fit your needs!";
    } else if (
      lowerMessage.includes("recommendation") ||
      lowerMessage.includes("suggest") ||
      lowerMessage.includes("similar")
    ) {
      reply =
        "Based on current trends, I'd recommend checking out our BestSellers and Latest Collections. These are handpicked items that our customers love. What category interests you?";
    } else if (
      lowerMessage.includes("help") ||
      lowerMessage.includes("support") ||
      lowerMessage.includes("question")
    ) {
      reply =
        "I'm here to help! I can assist you with: finding products, recommendations, answering questions about items, helping with your cart, and more. What can I do for you?";
    } else if (lowerMessage.includes("order") || lowerMessage.includes("cart")) {
      reply =
        "You can add items to your cart by clicking the add to cart button on any product page. If you need help with an existing order, please check your account or contact our support team.";
    } else {
      reply = `Thanks for asking! "${message}" - I'm here to help with any shopping needs. Feel free to ask me about products, recommendations, or anything else!`;
    }

    res.status(200).json({
      success: true,
      reply,
      timestamp: new Date(),
      message: "Chat response generated",
    });
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    res.status(500).json({
      success: false,
      message: "Error processing chat",
      error: error.message,
    });
  }
};
