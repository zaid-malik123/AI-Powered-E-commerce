<!-- 1️⃣ E-commerce ka High Level Flow 

User Flow

User → Browse Products → Add to Cart → Checkout → Payment → Order Created → Delivery


1️⃣ User Model
User
- id
- name
- email
- password
- role (USER | ADMIN)
- phone
- address[]
- createdAt

// USER DATA :- 

{
  "_id": "65fabc1234",
  "name": "Zaid Malik",
  "email": "zaid@gmail.com",
  "password": "$2b$10$hashedpassword",
  "role": "USER",
  "addresses": [
    {
      "fullName": "Zaid Malik",
      "phone": "9876543210",
      "street": "Street 21, Andheri West",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400053",
      "country": "India"
    }
  ],
  "createdAt": "2026-01-15T10:30:00Z"
}


2️⃣ Product Model
Product
- id
- title
- description
- price
- discountPrice
- images[]
- categoryId
- brand
- stock
- rating
- createdAt

// PRODUCT DATA :-

{
  "_id": "65fabcd567",
  "title": "iPhone 15 Pro",
  "description": "Apple iPhone 15 Pro with A17 chip",
  "price": 129999,
  "discountPrice": 119999,
  "images": [
    "https://image1.jpg",
    "https://image2.jpg"
  ],
  "categoryId": "65cat12345",
  "brand": "Apple",
  "stock": 25,
  "rating": 4.6,
  "totalReviews": 120,
  "isActive": true,
  "createdAt": "2026-01-15T11:00:00Z"
}


3️⃣ Category Model
Category
- id
- name
- parentId (optional)

🧪 Dummy Category Data (JSON)
Parent Category
{
  "_id": "65cat001",
  "name": "Electronics",
  "slug": "electronics",
  "parentId": null,
  "isActive": true,
  "createdAt": "2026-01-15T11:30:00Z"
}

Child Category
{
  "_id": "65cat002",
  "name": "Mobiles",
  "slug": "mobiles",
  "parentId": "65cat001",
  "isActive": true,
  "createdAt": "2026-01-15T11:31:00Z"
}

4️⃣ Cart Model
Cart
- id
- userId
- items[]

{
  "_id": "65cart001",
  "userId": "65user123",
  "items": [
    {
      "productId": "65prod001",
      "quantity": 2,
      "price": 119999
    },
    {
      "productId": "65prod002",
      "quantity": 1,
      "price": 2499
    }
  ],
  "totalPrice": 242497,
  "updatedAt": "2026-01-15T12:00:00Z"
}


CartItem
- productId
- quantity
- price

{
  "productId": "65prod001",
  "quantity": 2,
  "price": 119999
}

5️⃣ Order Model
Order
- id
- userId
- items[]
- totalAmount
- paymentStatus (PENDING | PAID | FAILED)
- orderStatus (PLACED | SHIPPED | DELIVERED)
- address
- createdAt

{
  "_id": "65order001",
  "userId": "65user123",
  "items": [
    {
      "productId": "65prod001",
      "title": "iPhone 15 Pro",
      "price": 119999,
      "quantity": 1
    },
    {
      "productId": "65prod002",
      "title": "AirPods Pro",
      "price": 24999,
      "quantity": 1
    }
  ],
  "totalAmount": 144998,
  "paymentStatus": "PAID",
  "orderStatus": "PLACED",
  "paymentMethod": "UPI",
  "shippingAddress": {
    "fullName": "Zaid Malik",
    "phone": "9876543210",
    "street": "Street 21, Andheri West",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400053",
    "country": "India"
  },
  "createdAt": "2026-01-15T13:00:00Z"
}

6️⃣ OrderItem Model
OrderItem
- productId
- quantity
- price

{
  "productId": "65prod001",
  "title": "iPhone 15 Pro",
  "price": 119999,
  "quantity": 1
}


7️⃣ Payment Model
Payment
- id
- orderId
- paymentMethod (UPI | CARD | COD)
- paymentStatus
- transactionId

{
  "_id": "65pay001",
  "orderId": "65order001",
  "userId": "65user123",
  "amount": 144998,
  "paymentMethod": "UPI",
  "paymentStatus": "SUCCESS",
  "transactionId": "razorpay_txn_98765",
  "gateway": "Razorpay",
  "createdAt": "2026-01-15T13:10:00Z"
}


8️⃣ Review Model 
Review
- id
- userId
- productId
- rating
- comment

{
  "_id": "65rev001",
  "userId": "65user123",
  "productId": "65prod001",
  "rating": 5,
  "comment": "Amazing product! Camera quality is top notch.",
  "createdAt": "2026-01-16T09:30:00Z"
}



🔐 Auth APIs
POST   /auth/register
POST   /auth/login
GET    /auth/logout
GET    /auth/me

📦 Product APIs
POST   /products        (Admin)
GET    /products
GET    /products/:id
PUT    /products/:id    (Admin)
DELETE /products/:id    (Admin)

GET  /admin/orders
PUT  /admin/orders/:id/status



🗂 Category APIs
POST   /categories
GET    /categories

🛒 Cart APIs
POST   /cart/add
PUT    /cart/update
GET    /cart
DELETE /cart/remove/:productId

📦 Order APIs
POST   /orders/create
GET    /orders/my
GET    /orders/:id

💳 Payment APIs
POST   /payment/initiate
POST   /payment/verify

⭐ Review APIs
POST   /reviews
GET    /products/:id/reviews


4️⃣ Complete Checkout Flow (VERY IMPORTANT)
Step-by-Step:
1. User adds product to cart
2. Cart calculate total
3. User clicks checkout
4. Create Order (status: PENDING)
5. Payment initiate
6. Payment success
7. Order status → PAID
8. Reduce product stock
9. Clear cart



 -->

Admin creates product
        ↓
Product MongoDB me save
        ↓
Product text prepare
(name + category + description)
        ↓
Embedding generate
(Gemini/OpenAI)
        ↓
Vector Pinecone me store
(with productId) 



User product page open karta hai
        ↓
Current product ka vector lo
        ↓
Pinecone similarity search
        ↓
Top similar product IDs
        ↓
MongoDB me un IDs se products fetch karo
        ↓
Frontend ko complete product data bhejo