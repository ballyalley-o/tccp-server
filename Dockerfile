FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY public ./public

RUN mkdir -p /app/public/upload /app/public/upload/badge /app/public/upload/avatar \
  && chown -R node:node /app

USER node

EXPOSE 3003

CMD ["npm", "run", "start:prod"]
