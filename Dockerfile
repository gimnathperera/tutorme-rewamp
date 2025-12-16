# -----------------------
# Builder stage
# -----------------------
FROM node:18-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# Build-time args
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER

# Copy dependency files first (cache-friendly)
COPY pnpm-lock.yaml package.json ./

# Install deps for build
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Inject NEXT_PUBLIC envs for Next.js build
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_WHATSAPP_NUMBER=$NEXT_PUBLIC_WHATSAPP_NUMBER

# Build Next.js (standalone)
RUN pnpm build

# -----------------------
# Runtime stage (LEAN)
# -----------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy ONLY what production needs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
