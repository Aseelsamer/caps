'use strict';

const eventsEmitter= require('./event');

eventsEmitter.on('pickup',payload=>{
    setTimeout(()=>{
console.log(`DRIVER: picked up ${payload.orderID}`)
eventsEmitter.emit('in-transit',payload);
    },1000);

    setTimeout(()=>{
        console.log(`DRIVER: delivered to  ${payload.orderID}`)
        eventsEmitter.emit('delivered',payload);
            },3000);
})