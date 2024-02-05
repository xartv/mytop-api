FROM node:20-alpine
WORKDIR /opt/app
ADD package.json package.json
RUN npm install -f
ADD . .
RUN npm run build
RUN npm prune --production -f
CMD ["node", "./dist/main.js"]