'use strict'

const net = require('net');

const client = new net.Socket();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

client.connect(port, host, () => {
    client.on('data', (data) => {
        const obj = JSON.parse(data);
        if (obj.event == 'pickup') {
            setTimeout(() => {
                console.log(`DRIVER: pickedup ${obj.payload.orderID}`);
                let message=JSON.stringify({event:'in-transit',payload:obj.payload});
                client.write(message);
            }, 1000);
            setTimeout(() => {
                console.log(`DRIVER: delivered up ${obj.payload.orderID} `);
                let msg=JSON.stringify({event:'delivered',payload:obj.payload});
                client.write(msg);
            }, 3000)
        }
    });
    client.on('close', () => console.log("vendor connection CLosed"));
    client.on('error', (e) => console.log("vendor Error", e));

});
// const eventsEmitter = require('./events')
// eventsEmitter.on('pickup', payload=>{
//     setTimeout(() => {
//         console.log(`DRIVER: pickedup ${payload.orderID} `)
//         eventsEmitter.emit('in-transit', payload)
//     }, 1000),
//     setTimeout(() => {
//         console.log(`DRIVER: delivered up ${payload.orderID} `)
//         eventsEmitter.emit('delivered', payload)
//     }, 3000)
// })