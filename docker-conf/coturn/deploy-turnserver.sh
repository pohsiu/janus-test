username="d8ai"
password="docto-a11y-d8ai"
realm="dimension8ai.com"

internalIp="$(ip a | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')"
externalIp="$(dig +short myip.opendns.com @resolver1.opendns.com)"

echo "listening-port=3478
tls-listening-port=5349
listening-ip="$internalIp"
relay-ip="$internalIp"
external-ip="$externalIp"
realm=$realm
server-name=$realm
lt-cred-mech
userdb=/var/lib/turn/turndb
# use real-valid certificate/privatekey files
cert=/etc/turn_server_cert.pem
pkey=/etc/turn_server_pkey.pem
 
no-stdout-log"  | tee /etc/turnserver.conf


turnadmin -a -u $username -p $password -r $realm

turnserver

echo "TURN server running. IP: "$externalIp" Username: "$username", password: "$password""
