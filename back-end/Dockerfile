FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3335

CMD ["npm", "run", "dev:server"]