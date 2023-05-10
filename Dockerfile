FROM node:18

RUN apk add python make gcc g++

WORKDIR /app

COPY ./api .

RUN npm ci
RUN npm run build

CMD ["node","dist/main.js"]
