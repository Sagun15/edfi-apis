# Use Node.js 23.2.0 as the base image
FROM node:23.2.0

# Set the working directory inside the container
WORKDIR /app

# Remove any existing Yarn binaries (yarnpkg and yarn)
RUN rm -f /usr/local/bin/yarn /usr/local/bin/yarnpkg

# Install Yarn version 1.22.22
RUN npm install -g yarn@1.22.22

# Install dependencies using Yarn
COPY package*.json ./
RUN yarn install

# Copy the entire application source code
COPY . .

# Build the application using Yarn
RUN yarn build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]