FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY scripts ./scripts
RUN npm ci --no-audit --prefer-offline --no-fund
RUN npx prisma generate
EXPOSE 3000
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]
