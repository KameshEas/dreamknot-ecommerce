# 1️⃣ Base image
FROM node:20-alpine

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy package files
COPY package.json package-lock.json* ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy app source
COPY . .

# 7️⃣ Build Next.js (without sensitive environment variables)
RUN npm run build

# 8️⃣ Expose port
EXPOSE 3000

# 9️⃣ Start Next.js
CMD ["npm", "run", "start"]
