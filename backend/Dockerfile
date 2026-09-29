FROM node:20-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY src ./src
COPY data ./data

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["node", "src/server.js"]
