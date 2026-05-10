FROM node:20-alpine
WORKDIR /app

# Instalar OpenSSL que necesita Prisma
RUN apk add --no-cache openssl openssl-dev libc6-compat

RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

COPY packages/database ./packages/database
COPY services/auth ./services/auth

RUN pnpm install --frozen-lockfile

WORKDIR /app/packages/database
RUN npx prisma generate

WORKDIR /app/services/auth
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/index.js"]