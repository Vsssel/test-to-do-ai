FROM node:20

WORKDIR /app

COPY package.json package-lock.json* ./

COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY apps/web/package.json ./apps/web/package.json

RUN npm ci

COPY . .

EXPOSE 3000


# Run dev server
CMD ["npm", "run", "dev", "--workspace=apps/web"]

