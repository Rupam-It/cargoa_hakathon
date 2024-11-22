# Use official Node.js runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container's working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code into the container
COPY . .

# Expose port 3001 to access the frontend app
EXPOSE 3001

# Run the React app with webpack-dev-server (for development mode)
CMD ["npx", "webpack-dev-server", "--mode", "development"]
