FROM node:18-alpine3.18

RUN apk add --no-cache --virtual python py3-pip pkgconfig make g++ libx11-dev libxext-dev libxi-dev
   
RUN python3 --version
WORKDIR /app

COPY ./api .

RUN npm -g install npm
RUN npm -g install node-gyp
RUN npm -g install make

RUN npm i
RUN npm run build

CMD ["node","dist/main.js"]