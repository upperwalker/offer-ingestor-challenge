## Description

Offers ingestor challenge

## Review Notes

- I have added a few JSDoc todos which can be addressed later
- I have considered using nest interceptors initially, but decided to isolate external providers requests from offers business domain for better scalability
- I used in-memory database to simlify project setup
- It took a bit longer that 2 hours, but I was free on Saturday :) 
## Installation

```bash
$ pnpm install
```
## Setup

```bash
$ nvm use
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

