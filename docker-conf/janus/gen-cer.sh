#!/bin/bash

#Change to your company details
country=TW
state=CarsonWang
locality=Taipei
organization=D8AI.com
organizationalunit=D8AI
email=carson.wang@d8ai.com

mkdir -p /opt/janus/share/janus/certs/
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout /opt/janus/share/janus/certs/privateKey.key -out /opt/janus/share/janus/certs/certificate.crt \
    -subj "/C=$country/ST=$state/L=$locality/O=$organization/OU=$organizationalunit/CN=$commonname/emailAddress=$email"
