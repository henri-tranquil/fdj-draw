FROM node:18

WORKDIR /app

COPY api ./api
COPY resources ./resources
COPY entrypoint.sh entrypoint.sh

RUN cd api && npm ci
RUN cd api && npm run build

ENTRYPOINT ["/bin/sh","entrypoint.sh"]
