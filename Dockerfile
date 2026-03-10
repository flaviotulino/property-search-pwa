FROM node:24-alpine
WORKDIR /app

# package json
COPY ./package.json package.json

RUN npm install

# copy source source
COPY . .

RUN npm run build