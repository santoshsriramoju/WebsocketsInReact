const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

//Spinning the hhtp server and the websocket server
const server = http.createServer();
server.listen(webSocketServerPort);
console.log(`listening on port 8000`);

const webServer = new webSocketServer({
    httpServer: server
});

const clients = {};

//This code generates unique userid for everyuser
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
}

webServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + `Received a new connection from origin` + request.origin + '.');

    //you can rewrite this part of the code to accept only the request from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log(`connected ` + userID + 'in' + Object.getOwnPropertyNames(clients));

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log(`Received Message `, message.utf8Data);

            //boradcasting message to all connected clients
            for (key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log(`Sent message to: `, clients[key]);
            }
        }
    })
});