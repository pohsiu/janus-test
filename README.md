# janus-test
Janus-gateway (videoRoom plugin demo), react version

## Available Scripts

In the project directory, you can run:
### demo steps (modify from https://github.com/linagora/docker-janus-gateway)
1. docker-compose up -d
2. yarn install
3. yarn start

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### ps.(the way to open wss/https port)
1. to docker shell
```
docker exec -ti [container id] bash
```
2. to file root
```
cd /opt/janus/etc/janus
vim janus.transport.websockets.jcfg
```
3. modify file content
```
wss = true                                              # Whether to enable secure WebSockets
wss_port = 8989                         # WebSockets server secure port, if enabled
```

4. like step2 & step3
```
vim janus.transport.http.jcfg
```
modify to ...
```
https = true                                    # Whether to enable HTTPS (default=no)
secure_port = 8089                              # Web server HTTPS port, if enabled
```
5. restart docker service
```
exit
docker restart [container_id]
```

To learn React, check out the [React documentation](https://reactjs.org/).

