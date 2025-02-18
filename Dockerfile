# https://levioconsulting.com/insights/how-to-dockerize-an-angular-application-with-nginx/

# Stage 1: Compile and Build angular codebase
FROM node:latest as build

WORKDIR /usr/local/app

COPY ./ /usr/local/app/

RUN npm install

RUN npm run build


# Stage 2: Serve app with nginx server
FROM nginx:latest

COPY --from=build /usr/local/app/dist/car_control_angular /usr/share/nginx/html

EXPOSE 80
