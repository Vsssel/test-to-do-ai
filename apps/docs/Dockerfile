FROM node:20

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy package.json files from workspaces
COPY packages/db/package.json ./packages/db/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY apps/docs/package.json ./apps/docs/package.json



# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Expose port
EXPOSE 3001

# Set environment variable for database
# (DATABASE_URL is provided via docker-compose env_file/.env)

# Run dev server
CMD ["npm", "run", "dev", "--workspace=apps/docs"]

