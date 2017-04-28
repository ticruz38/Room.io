#!/usr/bin/env node --harmony
const fs = require('fs');
var path = require("path");
const Moment = require('moment');
const program = require('commander');
const Ipfs = require('@haad/ipfs-api')

const Orders = require('./Order.json');
const Rooms = require('./Room.json');
const Stuffs = require('./Stuff.json');
const Users = require('./User.json');
const Store = require('./Store');


function uintRandom( int ) {
    return Math.round( Math.random() * (int - 1) );
}

function dropDb(dbName) {
    console.log("dropping db dbName");
    return new Promise( (resolve, reject) => {
        Store[dbName].then( db => {
            console.log(dbName + ' database ready, deleting items');
            const dbItems = db.query( o => !!o );
            if( !dbItems.length ) {
                console.log( 'there is no items in ' + dbName );
                resolve();
            }
            dbItems.map( (o, index) => 
                db.del(o._id).then( (removed) => {
                    console.log("removed " + removed._id )
                    if( (dbItems.length - 1) === index ) resolve();
                } )
        ) } )
    } )
}

function populateDb(dbName, items) {
    return new Promise( (resolve, reject) => {
        Store[dbName].then( dbOrder => {
            console.log(dbName + 'database ready, adding items');
            items.map( (i, index) =>
                dbOrder.put( i ).then( hash => {
                    console.log("added " + dbName + i._id + " with hash " + hash)
                    if( (items.length - 1) === index ) resolve();
                } )
            )
        } )
    } )
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
                Orders.map( o =>
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
    .option('-p, --populate', 'Populate ipfs right away')
    .option('-d, --drop', 'Drop the database')
    .option('-rName, --roomName <roomName>', 'In case of generating orders, the room that will get those orders')
    .action( file => {
        switch (file) {
            case "order":
                console.log('...generating orders', program.drop);
                aliveOrders(program.roomName).then( orders => {
                    fs.writeFile( path.resolve( __dirname, 'Order.json' ), 
                        JSON.stringify(orders),
                        err => {
                            if( err ) console.log('error', err) 
                            if( !program.drop && !program.populate ) process.exit();
                        }
                    );
                    if ( program.drop ) {
                        console.log('dropping');
                        dropDb('order').then( _ => {
                            if( !program.populate ) process.exit() 
                        } )
                    }
                    if ( program.populate ) {
                        populateDb('order', orders).then( _ => process.exit() );
                    }
                } )
                break;
            case "user":
                console.log('...regenerating users');
                const user = aliveUsers();
            case "init":
                console.log('initializing database');
                const ipfs = new Ipfs();
                const database = {
                    user: "QmbtUWXpAYZrejVY4YsUdtMKHeiu7UP6RS4o3xZcQiADYX", 
                    stuff: "QmR5iePpN2VsNteqjTPzDQJ3wz92A6iMVhoVF3JuUG8UQd", 
                    room: "QmSV967kLZ8Pnf814S128ZcSkkavTeL9ZUKf3cij5FQStC", 
                    order: "QmVhT86gRJGUdxcgnR2CqAMcrKbUvA5twWGPjnL5KUGYuf"
                }
                const object = new Buffer(JSON.stringify(database));
                ipfs.object.put(object).then( res => {
                    console.log(res.toJSON().multihash)
                    ipfs.name.publish( res.toJSON().multihash )
                        .then( name => {
                            console.log("initialized at node " + name.Name + " with hash " + name.Value);
                            // ipfs.object.get( res.toJSON().multihash, { enc: 'base58' })
                            //     .then( object => JSON.parse(object.toJSON().data) )
                            //     .then( object => {
                            //         console.log(object);
                            //     } )
                        } )
                        .catch( error => console.error(error))
                } )
            default:
                break;
        }
    } )
    .parse(process.argv)
