FROM ubuntu:16.04

# Prepare the system
RUN apt-get update -y && apt-get upgrade -y

# Install dependencies
RUN apt-get install -y libmicrohttpd-dev libjansson-dev \
	libssl-dev libsrtp-dev libsofia-sip-ua-dev libglib2.0-dev \
	libopus-dev libogg-dev libcurl4-openssl-dev liblua5.3-dev \
	libconfig-dev pkg-config gengetopt libtool automake
RUN apt-get install -y libini-config-dev libcollection-dev \
    libavutil-dev libavcodec-dev libavformat-dev

# Install extras
RUN apt-get install -y sudo make git doxygen graphviz cmake wget vim ffmpeg

# Install libnice without installing libnice-dev directly
RUN apt-get install -y gtk-doc-tools
RUN cd ~ && git clone https://gitlab.freedesktop.org/libnice/libnice --branch 0.1.16 --single-branch && \
    cd libnice && \
    ./autogen.sh && \
    ./configure --prefix=/usr && \
    make && make install

# Install libsrtp 2.2.0 (To reduce risk of broken interoperability with future WebRTC versions)
RUN cd ~ && wget https://github.com/cisco/libsrtp/archive/v2.2.0.tar.gz && \
    tar xfv v2.2.0.tar.gz && \
    cd libsrtp-2.2.0 && \
    ./configure --prefix=/usr --enable-openssl && \
    make shared_library && make install

# Install usrsctp for data channel support
RUN cd ~ && git clone https://github.com/sctplab/usrsctp && \
    cd usrsctp && \
    ./bootstrap && \
    ./configure --prefix=/usr && make && make install

# Install websocket dependencies
RUN LIBWEBSOCKET="3.0.1" && wget https://github.com/warmcat/libwebsockets/archive/v$LIBWEBSOCKET.tar.gz && \
    tar xzvf v$LIBWEBSOCKET.tar.gz && \
    cd libwebsockets-$LIBWEBSOCKET && \
    mkdir build && \
    cd build && \
    cmake -DCMAKE_INSTALL_PREFIX:PATH=/usr -DCMAKE_C_FLAGS="-fpic" -DLWS_MAX_SMP=1 -DLWS_IPV6="ON" .. && \
    make && make install

# Copy the apache configuration files ready for when we need them
COPY apache2-conf/* ./
# Install and prepare apache
RUN apt-get update && apt-get install -y apache2  && \
    cp ./apache2.conf /etc/apache2  && \
    cp ./000-default.conf /etc/apache2/sites-available

# Install and prepare pythonServer
RUN apt-get update && sudo apt-get -y install python3-pip && \
  pip3 install virtualenv && \
  pip3 install --upgrade pip && \
  mkdir /opt/pythonServer && \
  cd /opt/pythonServer && \
  virtualenv flask && \
  flask/bin/pip install flask

# Clone, build and install the gateway
RUN cd ~ && git clone https://github.com/meetecho/janus-gateway.git && \
    cd janus-gateway && \
    #git reset --hard 662f1c8 && \
    sh autogen.sh && \
    ./configure --prefix=/opt/janus --disable-rabbitmq --disable-mqtt --disable-docs --enable-post-processing && \
    make && make install && make configs

COPY gen-cer.sh ./
RUN bash gen-cer.sh

COPY flaskRoot/* /opt/pythonServer/
# Put configs in place
COPY janus-conf/* /opt/janus/etc/janus/
# COPY janus-demo-conf/* /opt/janus/share/janus/demos/
COPY startup.sh ./
COPY merge_video.sh ./
COPY processVideo.sh ./

RUN a2enmod ssl

# Declare the ports we use
EXPOSE 80 7088 8088 8188
