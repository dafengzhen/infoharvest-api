FROM node:22-alpine AS deps
WORKDIR /infoharvest
COPY --chown=node:node package*.json .npmrc ./
RUN npm ci
COPY --chown=node:node . .
USER node

FROM node:22-alpine AS builder
WORKDIR /infoharvest
COPY --chown=node:node package*.json .npmrc ./
COPY --chown=node:node --from=deps /infoharvest/node_modules ./node_modules
COPY --chown=node:node . .
ENV NODE_ENV=production
RUN npm run build
USER node

FROM node:22-alpine AS runner
WORKDIR /infoharvest
COPY --chown=node:node --from=builder /infoharvest/.env ./.env
COPY --chown=node:node --from=builder /infoharvest/node_modules ./node_modules
COPY --chown=node:node --from=builder /infoharvest/dist ./dist
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE $PORT
CMD ["node", "dist/main.js"]
