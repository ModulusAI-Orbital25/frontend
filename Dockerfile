FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV NEXT_PUBLIC_API_URL=/api
ENV NEXT_PUBLIC_BACKEND_URL=https://backend-sparkling-cloud-9951.fly.dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
