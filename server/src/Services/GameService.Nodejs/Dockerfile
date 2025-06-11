FROM alpine

WORKDIR /app

RUN apk add --no-cache nodejs pnpm git

COPY package.json pnpm-lock.yaml .
RUN pnpm install

COPY . .
RUN mv .env.example .env 

CMD ["pnpm", "run", "start"]
