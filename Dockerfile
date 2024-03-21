FROM ubuntu:18.04 AS builder

RUN apt-get update
RUN apt-get remove -y gyp
RUN apt-get -y install curl bzip2 build-essential g++ python git make gcc gcc-multilib node-gyp sudo
RUN apt-get install -y pkg-config xserver-xorg-dev libxext-dev pkg-config libxi-dev libglu1-mesa-dev libglew-dev
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
RUN apt-get install -y build-essential
RUN apt-get install -y nodejs

RUN npm install prebuild-install node-pre-gyp -g

COPY ./api .

RUN npm ci
RUN npm run build

CMD ["node","dist/main.js"]
