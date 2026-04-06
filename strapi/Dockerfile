FROM node:22-alpine

# Abhängigkeiten für libvips (Image Processing)
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app

# Wir kopieren die package Dateien
COPY package.json package-lock.json* ./

# Installation inklusive Postgres-Treiber
RUN npm install

COPY . .

# Pfad zu den Binaries
ENV PATH /opt/app/node_modules/.bin:$PATH

RUN npm run build

EXPOSE 1337

# Da wir "develop" in scripts haben, nutzen wir npm run
CMD ["npm", "run", "develop"]
