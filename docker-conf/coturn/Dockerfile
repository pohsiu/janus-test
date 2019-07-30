FROM ubuntu:16.04

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

EXPOSE 3478

RUN apt-get update && apt-get install -y \
    dnsutils coturn openssl && \
    rm -rf /var/lib/apt/lists/*

COPY gen-cer.sh ./
RUN bash gen-cer.sh

ENTRYPOINT ["bash", "deploy-turnserver.sh"]
