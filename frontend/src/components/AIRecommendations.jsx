import { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi";
import Card from "./Card";

const AIRecommendations = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAIRecommendations();
  }, [userId]);

  const fetchAIRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/recommendations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
              const baseUrl =
                import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL ||
                "http://localhost:3000";
              const response = await fetch(
                `${baseUrl}/api/ai/recommendations`,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch recommendations");
      const data = await response.json();
      setRecommendations(data.products || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500 flex items-center justify-center gap-2">
          <HiSparkles className="animate-spin" /> Loading AI Recommendations...
        </p>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 py-8">
      <div className="flex items-center gap-3 mb-6">
        <HiSparkles className="text-blue-500 text-2xl" />
        <h2 className="text-2xl font-semibold text-gray-700">
          AI Recommended For You
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.slice(0, 8).map((item) => (
          <Card
            key={item._id}
            item={{
              image: item.image,
              title: item.name,
              price: item.price,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
