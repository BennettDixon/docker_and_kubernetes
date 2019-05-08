# prepare builder stage image
FROM node:alpine as builder
WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run build

# run server in run stage
FROM nginx
# AWS EBS Instance looks for this line, does nothing locally
EXPOSE 3005
# Copy built app to current directory
COPY --from=builder /app/build /usr/share/nginx/html
