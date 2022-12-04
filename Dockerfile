FROM node:18

WORKDIR /app

COPY ./api .

RUN npm ci
RUN npm run build

CMD ["node","dist/main.js"]
