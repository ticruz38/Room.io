#!/usr/bin/env node --harmony
const fs = require('fs');
var path = require("path");
const Moment = require('moment');
const program = require('commander');

const Orders = require('./Order.json');
const Rooms = require('./Room.json');
const Stuffs = require('./Stuff.json');
const Users = require('./User.json');
const Store = require('./Store');


function uintRandom( int ) {
    return Math.round( Math.random() * (int - 1) );
}

const aliveRooms = () => {
    return Rooms.map( ( r, index ) => Object.assign( r, {
        userId: Users[index]._id
    } ) )
}

const aliveUsers = () => {
    return Users.map( (u, index) => Object.assign( {}, u, {
        roomId: Rooms[index]._id
    } ) )
}

const aliveStuffs = () => {
    return Stuffs.map( (s, index) => Object.assign( {}, s, {
        roomId: Rooms[ index % 50 ]._id
    } ) )
}

const randomOrderStuff = () => {
    const stuffs = [];
    for (let i = 0; i < uintRandom( 10 ); i++ ) {
        stuffs.push( Stuffs[ uintRandom( 150 ) ]._id )
    }
    return stuffs;
}

// order generated per room, per day
const aliveOrders = (roomName) => {
    return new Promise( (resolve, reject ) => {
        const roomId = new Promise( (s, f) => {
            if( !program.roomName ) return s( Rooms[ 0 ]._id );
            Store.order.then( dbOrder => {
                s(dbOrder.query( o => o.name === roomName )[0]._id);
            } )
        } )
        roomId.then( id => {
            resolve(
                Orders.map( (o, index ) => 
                    Object.assign( {}, o, {
                        stuffIds: randomOrderStuff(),
                        clientId: Users[ uintRandom( 50 ) ]._id,
                        roomId: id,
                        created: Moment().startOf('days').add( uintRandom( 24 * 60), 'minutes' ).unix(),
                        treated: this.created < Moment().unix
                    } ) 
                ) 
            )
        } )
    } )
}

program
    .arguments('<file>')
    .option('-p, --populate <populate>', 'Populate ipfs right away')
    .option('-d, --drop <drop>', 'Drop the database')
    .option('-rName, --roomName <roomName>', 'In case of generating orders, the room that will get those orders')
    .action( file => {
        switch (file) {
            case "order":
                console.log('...generating orders');
                aliveOrders(program.roomName).then( orders => {
                    fs.writeFile( path.resolve( __dirname, 'Order.json' ), JSON.stringify(orders), err => console.log('error', err) )
                    if ( program.drop ) {
                        Store.order.then( dbOrder => {
                            console.log('order database ready, deleting items');
                            dbOrder.query( o => !!o).map( o => 
                                dbOrder.del(o._id).then( (removed) => 
                                    console.log("removed" + removed._id ) )
                        ) } )
                    }
                    if ( program.populate ) {
                        Store.order.then( dbOrder => {
                            console.log('order database ready, adding items');
                            orders.map( o =>
                                dbOrder.put( o ).then( hash => 
                                    console.log("added order " + o._id + " with hash " + hash) 
                                )
                            )
                        } )
                    }
                } )
                break;
            case "user":
                console.log('...regenerating users');

            default:
                break;
        }
    }  )
    .parse(process.argv)
