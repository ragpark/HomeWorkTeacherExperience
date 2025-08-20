# Multi-stage build for backend service
FROM node:18-alpine AS install
WORKDIR /app
COPY package.json ./
RUN npm install --production
COPY . .

FROM node:18-alpine
WORKDIR /app
COPY --from=install /app /app
ENV PORT=3001
EXPOSE 3001
CMD ["node", "index.js"]
