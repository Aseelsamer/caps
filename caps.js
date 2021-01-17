'use strict';


const eventsEmitter =require('./event');
require('./vendor');
require('./driver');

eventsEmitter.on('pickup',payload=>logIt('pickup',payload));
eventsEmitter.on('in-transit',payload=>logIt('in-transit',payload));
eventsEmitter.on('delivered',payload=>logIt('delivered',payload));

function logIt(event,payload){
    let time = new Date();
    console.log({event,time,payload})
}