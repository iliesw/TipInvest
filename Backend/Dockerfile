# Start with a base image for Bun
FROM jarredsumner/bun:latest

# Set the working directory inside the container
WORKDIR /

# Copy the app's code into the container
COPY . .

# Install dependencies
RUN bun install

# Expose the port the app will run on
EXPOSE 3000

# Run the application when the container starts
CMD ["bun", "src/server.js"]
