FROM node:20-alpine

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

# watch permet d'utiliser tsx watch ./src/index.ts qui permet d'exec un serveur typescript en mode watch avec hot reload

CMD ["npm", "run", "watch", "--host", "0.0.0.0"]