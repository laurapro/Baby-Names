# Dockerfile

# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Command to run your application
CMD ["npm", "start"]
