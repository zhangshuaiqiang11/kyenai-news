FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder

ARG NEXT_PUBLIC_API_BASE_URL=https://api.kyenai.com
ARG NEXT_PUBLIC_SITE_URL=https://www.kyenai.com
ARG NEXT_PUBLIC_GA_ID=
ARG NEXT_PUBLIC_EDITORIAL_EMAIL=

ENV NEXT_DIST_DIR=.next-build \
    NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID} \
    NEXT_PUBLIC_EDITORIAL_EMAIL=${NEXT_PUBLIC_EDITORIAL_EMAIL}

COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_DIST_DIR=.next-build \
    API_BASE_URL=http://backend:8000

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next-build ./.next-build

EXPOSE 3000

CMD ["npm", "run", "start"]
