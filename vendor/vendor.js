'use strit';

require('dotenv').config();
let faker = require('faker');

const net = require('net');

const client = new net.Socket();
const host = process.env.HOST;
const port = process.env.PORT || 3000;
let storeName = process.env.STORE_NAME;

client.connect(port, host, () => {
    client.on('data', (data) => {
        const obj = JSON.parse(data);
        if (obj.event == 'delivered') { console.log(`Thank you for delivering ${obj.payload.orderID}`) }
    });
    client.on('close', () => console.log("vendor connection CLosed"));
    client.on('error', (e) => console.log("vendor Error", e));
});

setInterval(function () {
    let orderId = faker.random.uuid();
    let name = faker.name.findName();
    let adress = faker.address.city();
    let payload= {
        store: storeName,
        orderID: orderId,
        coustomer: name,
        address: adress
    }
    let Event=JSON.stringify({event:'pickup',payload:payload});
    client.write(Event);
}, 5000);

// const eventsEmitter = require('./events');


// setInterval(function() {
//     let orderId=faker.random.uuid();
//     let name=faker.name.findName();
//     let adress=faker.address.city();
//     let obj={
//         store:storeName,
//         orderID: orderId,
//         coustomer:name,
//         address:adress
//     }
//     eventsEmitter.emit('pickup',obj)
// }, 5000);

// eventsEmitter.on('delivered',payload=>{console.log(`Thank you for delivering ${payload.orderID}`)})