import { useState } from "react";
import { HiSparkles } from "react-icons/hi";
import { FiLoader } from "react-icons/fi";

const AIProductAnalyzer = ({ product }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
       const baseUrl =
         import.meta.env.VITE_API_URL || import.meta.env.VITE_BASE_URL ||
         "http://localhost:3000";
       const response = await fetch(`${baseUrl}/api/ai/analyze-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to analyze product");
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
      console.error("Analysis error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <HiSparkles className="text-blue-500" size={20} />
        <h3 className="text-lg font-semibold text-gray-700">
          AI Product Insights
        </h3>
      </div>

      {!analysis && !loading && (
        <button
          onClick={generateAnalysis}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
        >
          <HiSparkles size={18} />
          Generate AI Analysis
        </button>
      )}

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-500 flex items-center justify-center gap-2">
            <FiLoader className="animate-spin" /> Analyzing...
          </p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {analysis && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Summary</h4>
            <p className="text-gray-600 text-sm">{analysis.summary}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-2">Highlights</h4>
            <ul className="space-y-1">
              {analysis.highlights?.map((highlight, idx) => (
                <li key={idx} className="text-gray-600 text-sm flex gap-2">
                  <span>✓</span> {highlight}
                </li>
              ))}
            </ul>
          </div>

          {analysis.recommendations && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">
                Why You Might Like This
              </h4>
              <p className="text-gray-600 text-sm">{analysis.recommendations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIProductAnalyzer;
