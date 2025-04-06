# For hosting on dev environment

FROM node:20.14.0-alpine as buildNode

WORKDIR /project-build

COPY ./ /project-build

RUN npm install --legacy-peer-deps

RUN npm run build

# Application serve
FROM nginx:1.27.0-alpine

COPY --from=buildNode /project-build/dist/cyber-report-hub-site/browser /etc/nginx/html
COPY --from=buildNode /project-build/dev-environment-files/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80