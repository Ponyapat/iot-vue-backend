# build stage
FROM node:16.18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:vite


#production stage
FROM nginx:mainline-alpine as production-stage

WORKDIR /app

ENV TZ Asia/Bangkok

RUN apk add --no-cache tini tzdata supervisor && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Configure supervisord
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

COPY --from=build-stage /app .
COPY docker/nginx.stg.conf /etc/nginx/nginx.conf
COPY docker/dev-robots.txt dist/robots.txt

EXPOSE 8080

ENTRYPOINT ["tini", "--"]

CMD ["sh","-c","/usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf"]