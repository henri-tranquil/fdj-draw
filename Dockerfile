FROM node:18-alpine

RUN apk --no-cache add --virtual .builds-deps build-base python3 make gcc g++ pkgconfig
WORKDIR /app

COPY ./api .

RUN npm ci
RUN npm run build

CMD ["node","dist/main.js"]
