# --- STAGE 1: Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Dependency files copy karo taaki caching ka fayda mile
COPY package*.json ./
RUN npm ci

# Baaki saara frontend code copy karo
COPY . .

# Vite production build generate karega (jo 'dist' folder banayega)
RUN npm run build

# --- STAGE 2: Production Stage (Nginx) ---
FROM nginx:alpine AS runner

# Vite ka output 'dist' folder me aata hai, use Nginx ke webroot me copy karo
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx configuration copy karo jo React Router ko handle karegi
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]