FROM denoland/deno:alpine-2.1.10

# Create app directory and set permissions early
WORKDIR /app

# Copy files as root first
COPY . .

# Set proper ownership for the app directory
RUN chown -R deno:deno /app

# Switch to deno user
USER deno

RUN deno install

# The port that your application listens to
EXPOSE 8080

# Run the application using task
CMD ["deno", "task", "main"]