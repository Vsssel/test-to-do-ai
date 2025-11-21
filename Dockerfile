FROM node:20

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy package.json files from workspaces
COPY packages/db/package.json ./packages/db/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/docs/package.json ./apps/docs/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Expose port
EXPOSE 3001

# Set environment variable for database
ENV DATABASE_URL=postgres://admin:admin@db:5432/appdb

# Run dev server
CMD ["npm", "run", "dev", "--workspace=apps/docs"]

