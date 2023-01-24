FROM node:lts-alpine
COPY . /app
WORKDIR /app
RUN npm install
ENV NODE_ENV=production
ENTRYPOINT [ "npm", "start" ]