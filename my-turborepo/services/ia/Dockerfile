FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl openssl-dev libc6-compat
RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY packages/database ./packages/database
COPY services/ia ./services/ia

RUN pnpm install --frozen-lockfile

WORKDIR /app/services/ia
RUN npm run build

EXPOSE 3003
CMD ["node", "dist/index.js"]