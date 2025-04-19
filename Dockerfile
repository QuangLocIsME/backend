FROM node:18.20.5

WORKDIR /app

COPY package*.json ./

RUN npm install --production
RUN npm rebuild bcrypt --build-from-source

COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"] 