## Prerequire

For this project production version, we assume that we have Docker installed on the device. 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API

### Euromillions
To access to Euromillions data, you need to use route `/euromillions`

- For all draw since beginning :
```
GET localhost:3000/euromillions/all
```
- For latest draw :
```
GET localhost:3000/euromillions
```

## Docker

To rebuild image, you need to execute `docker-compose build` before `docker-compose up -d`