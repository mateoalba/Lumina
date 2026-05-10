FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache openssl openssl-dev libc6-compat
RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY pnpm-lock.yaml ./

COPY apps/web ./apps/web
COPY packages ./packages

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/web

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]