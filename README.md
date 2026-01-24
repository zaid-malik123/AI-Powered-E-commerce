# E-Commerce Platform with AI Integration

A complete e-commerce platform with cutting-edge AI features for enhanced shopping experience.

## 🚀 Key Features

### AI-Powered Features
- **🤖 AI Chat Assistant** - Real-time conversational support with floating widget
- **🔍 Smart Search** - AI-powered search with intelligent suggestions
- **⭐ Personalized Recommendations** - ML-based product recommendations
- **📊 Product Analysis** - AI-generated insights and product analysis
- **💡 Intelligent Filtering** - Smart product discovery and filtering

### Core E-Commerce Features
- **User Authentication** - Secure login and signup
- **Product Catalog** - Browse and filter products
- **Shopping Cart** - Add products to cart
- **Collection Management** - Organize products by categories
- **Responsive Design** - Works on all devices
- **Redux State Management** - Centralized state management

## 📁 Project Structure

```
e-commerce/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── user.controllers.js
│   │   │   ├── product.controllers.js
│   │   │   └── ai.controllers.js (NEW)
│   │   ├── models/
│   │   ├── routes/
│   │   │   ├── user.routes.js
│   │   │   ├── product.routes.js
│   │   │   └── ai.routes.js (NEW)
│   │   └── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AIChat.jsx (NEW)
│   │   │   ├── AIRecommendations.jsx (NEW)
│   │   │   ├── AIProductAnalyzer.jsx (NEW)
│   │   │   ├── SmartSearch.jsx (NEW)
│   │   │   └── ... other components
│   │   ├── hooks/
│   │   │   ├── useAIRecommendations.jsx (NEW)
│   │   │   ├── useAISearch.jsx (NEW)
│   │   │   └── ... other hooks
│   │   ├── pages/
│   │   │   ├── Collection.jsx (UPDATED)
│   │   │   ├── Home.jsx (UPDATED)
│   │   │   └── ProductDetail.jsx (NEW)
│   │   └── App.jsx (UPDATED)
│   └── package.json
│
└── SETUP_GUIDE.md (NEW)
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** (use `.env.example` as template)
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   - Add MongoDB URI
   - Set JWT secret
   - Configure ImageKit credentials

5. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env.local` file** (use `.env.local.example` as template)
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure environment variables**
   - Set API URL to backend
   - Set Base URL for API calls

5. **Start the development server**
   ```bash
   npm run dev
   ```
   App runs on `http://localhost:5173`

## 🎯 How to Use the AI Features

### 1. AI Chat Assistant
- Located as a floating button in bottom-right corner
- Click the spark icon to open chat
- Ask questions about products, shopping, or recommendations
- Real-time responses with conversation history

### 2. Smart Search
- Use the search bar in navigation
- AI provides intelligent suggestions as you type
- Results are ranked by relevance and popularity
- Semantic search understands product intent

### 3. Personalized Recommendations
- Visible on home page after login
- Based on user preferences and browsing history
- Updates as you interact with products
- "AI Recommended For You" section

### 4. Product Analysis
- Click "Generate AI Analysis" on product detail page
- Get insights about the product
- View highlights and recommendations
- Understand pricing and value proposition

### 5. Smart Filters
- Use category and type filters on collection page
- Combine with smart search for better results
- AI helps match your needs with products

## 📚 API Documentation

### AI Endpoints

#### 1. Get Recommendations
```http
POST /api/ai/recommendations
Content-Type: application/json

{
  "userId": "user_id_here"
}

Response:
{
  "success": true,
  "products": [...],
  "message": "AI recommendations fetched successfully"
}
```

#### 2. Analyze Product
```http
POST /api/ai/analyze-product
Content-Type: application/json

{
  "productId": "product_id",
  "name": "Product Name",
  "price": 99.99,
  "category": "Men"
}

Response:
{
  "success": true,
  "analysis": {
    "summary": "...",
    "highlights": [...],
    "recommendations": "...",
    "priceAnalysis": "...",
    "bestFor": "..."
  }
}
```

#### 3. Smart Search
```http
POST /api/ai/smart-search
Content-Type: application/json

{
  "query": "blue shirt"
}

Response:
{
  "success": true,
  "products": [...],
  "query": "blue shirt",
  "count": 10
}
```

#### 4. Search Suggestions
```http
GET /api/ai/search-suggestions?query=shirt

Response:
{
  "success": true,
  "suggestions": [
    "Blue Shirt",
    "White Shirt",
    "Formal Shirt",
    ...
  ]
}
```

#### 5. Chat with AI
```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "Help me find a blue shirt",
  "conversationHistory": [...]
}

Response:
{
  "success": true,
  "reply": "I can help you find the perfect blue shirt...",
  "timestamp": "2024-01-23T10:30:00Z"
}
```

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File upload
- **ImageKit** - Image optimization

## 🚀 Performance Features

- **Lazy Loading** - Components load on demand
- **Image Optimization** - ImageKit integration
- **Smart Caching** - Reduced API calls
- **Fast Search** - Indexed MongoDB queries
- **Responsive Design** - Mobile-first approach

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for secure passwords
- **CORS Protection** - Cross-origin request handling
- **HTTP-only Cookies** - Secure cookie storage
- **Input Validation** - Server-side validation

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🐛 Troubleshooting

### Frontend Issues

**API Connection Error**
- Check if backend is running on port 5000
- Verify `.env.local` has correct API URL
- Check CORS settings in backend

**Chat Widget Not Appearing**
- Clear browser cache
- Check console for JavaScript errors
- Ensure AIChat component is imported in App.jsx

**Search Not Working**
- Verify backend API is running
- Check network tab for API calls
- Ensure products exist in database

### Backend Issues

**MongoDB Connection Error**
- Verify MongoDB URI in `.env`
- Check if MongoDB service is running
- Confirm network access is allowed

**Port Already in Use**
- Change PORT in `.env`
- Kill process using port 5000
- Use `lsof -i :5000` to find process

## 📈 Future Enhancements

- [ ] Integration with OpenAI API for better AI responses
- [ ] Google Gemini integration for multimodal analysis
- [ ] Advanced ML-based recommendation engine
- [ ] Voice search capability
- [ ] Multi-language support
- [ ] Customer review analysis
- [ ] Predictive inventory management
- [ ] Real-time order tracking with AI

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues and questions:
1. Check the SETUP_GUIDE.md
2. Review API documentation
3. Check console for error messages
4. Contact development team

## 🎉 Acknowledgments

- React team for amazing framework
- Tailwind CSS for beautiful styling
- MongoDB for reliable database
- ImageKit for image optimization

---

**Happy Coding! 🚀**

Built with ❤️ for amazing shopping experiences
