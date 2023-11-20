FROM node:18.17.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 12080

CMD ["npm", "run", "dev"]