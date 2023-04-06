FROM node:latest

WORKDIR .

COPY ./package*.json ./
RUN npm install

COPY . ..

EXPOSE 8080
CMD ["node", "config/config.js"]
CMD ["node", "inicijalizacijaBaze.js"]
CMD ["node", "index.js"]