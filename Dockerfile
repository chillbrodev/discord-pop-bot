FROM denoland/deno:alpine-2.1.10

RUN mkdir /app/
COPY . /app/
WORKDIR /app/

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY . .
# deno install installs your dependencies at lightning speed
RUN deno install

# The port that your application listens to.
EXPOSE 8080

CMD ["task", "main"]