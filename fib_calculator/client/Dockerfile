# node alpine image setup
FROM node:alpine as builder
WORKDIR '/app'
# package install
COPY ./package*.json ./
RUN npm install && \
    # fixes some vulnerabilities in npm package versioning
    npm audit fix
# copy rest in second step for cached packages img
COPY . .
# build our app for production
RUN npm run build


# using NGINX for wSGI
FROM nginx
EXPOSE 3000
COPY --from=builder /app/nginx_conf/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html