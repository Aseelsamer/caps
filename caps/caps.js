
'use strict';
require('dotenv').config();
const io = require('socket.io')(process.env.PORT||3000);

// Global Operations - Default Namespace
io.on('connection', (socket)=> {
    console.log("Welcome to Global Connection ! ");
   
    socket.on("error", (payload)=> {
        io.emit("error", payload);
    });

    socket.on("action", (payload)=> {
        console.log("from server: payload: ", payload);
        io.emit("action", payload);
    });

})


    // caps NameSpace
    const caps = io.of('/caps');
    caps.on('connection', (socket)=> {
        console.log("Connected to caps NameSpace", socket.id);
        let currentVndor = '';
        // when a user joins a new room, all of their chatting will happen there
        socket.on('join', vendor => {
            socket.join(vendor);
            currentVndor = vendor;
            console.log("joined store : ", vendor);
            // send a message to anyone connected to the non namespaced server
            io.emit('action', `Someone Joined Store : ${vendor}`);

            // this is sending on the socket ID, this goes to the sender
            caps.to(`${socket.id}`).emit('joined', vendor);
        });

        socket.on('pickup', payload=> {
            // everyone will recieve it including the sender
            caps.emit('pickup', payload);
            logIt('pickup', payload)
        });
        socket.on('in-transit', payload=> {
            // everyone will recieve it including the sender
            caps.emit('in-transit', payload);
            logIt('in-transit', payload)

        });
   
        socket.on('delivered', payload=> {
            // everyone will recieve it including the sender
            caps.emit('delivered', payload);
            logIt('delivered', payload)
        });
   
   
    });
    function logIt(event, payload) {
            let time = new Date().toLocaleString();
            console.log({ event, time, payload })
        }

/////////////tcp branch
// const net = require('net');
// const port = 3000;

// const server = net.createServer();
// server.listen (port, () => {
//     console.log(`listenning on ${port}`);
// });
// let socketPool = {};

// server.on('connection', (socket) => {
//     const id = Math.random();
//     socketPool[id] = socket;
//     socket.on('data', (buffer) => dispatchEventData(buffer));
//     socket.on('error', (e) => console.log('SOCKET ERROR', e));
//     socket.on('end', (e) => delete socketPool[id]);
// });

// function dispatchEventData(buffer) {
//     let data = JSON.parse(buffer.toString().trim());
//     if (data.event && data.payload) {
//         broadcast(data);
//         logIt(data.event, data.payload);
//     }
// }

// function logIt(event, payload) {
//     let time = new Date().toLocaleString();
//     console.log({ event, time, payload })
// }

// function broadcast(message) {
//     let payload = JSON.stringify(message);
//     for (let socket in socketPool) {
//         socketPool[socket].write(payload);
//     }
// }



/////////event branch 

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