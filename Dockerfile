# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package.json ./
RUN npm install

# Copy source + configs
COPY . .

# Prisma (safe dummy URL)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

# Build Next.js (Tailwind runs HERE)
RUN npm run build


# ---------- RUNTIME STAGE ----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy ONLY standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# IMPORTANT: start standalone server directly
CMD ["node", "server.js"]
