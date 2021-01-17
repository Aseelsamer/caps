'use strict';
require('dotenv').config();
const storeName = process.env.storeName;
const faker = require('faker');
const eventsEmitter = require('./event');


setTimeout(function() {
    let orderID=faker.random.uuid();
    let customer= faker.name.findName();
    let address= faker.address.city();
    
        let Obj ={
            store :storeName,
            orderID:orderID,
            customer:customer,
            address:address
    
}
eventsEmitter.emit('pickup',Obj);
}, 5000);

eventsEmitter.on('delivered',payload => console.log(`Thank you for delevering ${payload.orderID}`));



