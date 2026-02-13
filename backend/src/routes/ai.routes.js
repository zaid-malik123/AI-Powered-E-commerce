import express from "express";
import {
  getRecommendations,
  analyzeProduct,
  smartSearch,
  searchSuggestions,
  chatWithAI,
} from "../controllers/ai.controllers.js";

const router = express.Router();

// AI Recommendations
router.post("/recommendations", getRecommendations);

// Product Analysis
router.post("/analyze-product", analyzeProduct);

// Smart Search
router.post("/smart-search", smartSearch);

// Search Suggestions
router.get("/search-suggestions", searchSuggestions);

// Chat with AI
router.post("/chat", chatWithAI);

export default router;
