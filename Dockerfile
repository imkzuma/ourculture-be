FROM node:18
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --only=production
COPY . .
CMD ["npm", "start"]