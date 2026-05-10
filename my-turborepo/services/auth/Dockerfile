FROM node:20-alpine
WORKDIR /app

RUN npm install -g pnpm

# Copiar archivos raíz del monorepo
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# Copiar packages/database (donde está prisma)
COPY packages/database ./packages/database

# Copiar servicio auth
COPY services/auth ./services/auth

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Generar cliente Prisma
WORKDIR /app/packages/database
RUN npx prisma generate

# Build auth
WORKDIR /app/services/auth
RUN npm run build

EXPOSE 3001
CMD ["node", "dist/index.js"]