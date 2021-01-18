'use strict'
const net = require('net');
const port = 3000;

const server = net.createServer();
server.listen (port, () => {
    console.log(`listenning on ${port}`);
});
let socketPool = {};

server.on('connection', (socket) => {
    const id = Math.random();
    socketPool[id] = socket;
    socket.on('data', (buffer) => dispatchEventData(buffer));
    socket.on('error', (e) => console.log('SOCKET ERROR', e));
    socket.on('end', (e) => delete socketPool[id]);
});

function dispatchEventData(buffer) {
    let data = JSON.parse(buffer.toString().trim());
    if (data.event && data.payload) {
        broadcast(data);
        logIt(data.event, data.payload);
    }
}

function logIt(event, payload) {
    let time = new Date().toLocaleString();
    console.log({ event, time, payload })
}

function broadcast(message) {
    let payload = JSON.stringify(message);
    for (let socket in socketPool) {
        socketPool[socket].write(payload);
    }
}
// const eventsEmitter = require('./events')
// require('./vendor')
// require('./driver')
// eventsEmitter.on('pickup', payload =>logIt('pickup' , payload))
// eventsEmitter.on('in-transit', payload =>logIt('in-transit' , payload))
// eventsEmitter.on('delivered', payload =>logIt('delivered' , payload))
// function logIt(event, payload){
//     let time = new Date();
//     console.log({event, time, payload})
// }