FROM alpine

WORKDIR /app

RUN apk add --no-cache nodejs pnpm

COPY package.json pnpm-lock.yaml .
RUN pnpm install

COPY . .
RUN mv .env.example .env 

RUN pnpm run gen

RUN pnpm run build

CMD ["pnpm", "start"]
