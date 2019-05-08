# prepare builder stage image
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

# run server in run stage
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html