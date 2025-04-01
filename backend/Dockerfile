FROM node:23-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD sh -c "npx prisma db push --accept-data-loss && npx prisma db seed && npm run watch --host 0.0.0.0"