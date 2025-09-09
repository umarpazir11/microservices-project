# 1. Start with an official Node.js base image
FROM node:18

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy your package.json and package-lock.json files
COPY package*.json ./

# 4. Install the application's dependencies
RUN npm install

# 5. Copy the rest of your application's code (server.js)
COPY . .

# 6. Expose the port the service runs on
EXPOSE 3002

# 7. Define the command to start the service
CMD [ "node", "server.js" ]