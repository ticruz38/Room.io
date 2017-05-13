#!/usr/bin/env node --harmony
const fs = require("fs");
var path = require("path");
const Moment = require("moment");
const program = require("commander");

const Orders = require("./Order.json");
const Rooms = require("./Room.json");
const Stuffs = require("./Stuff.json");
const Users = require("./User.json");
const Pictures = require('./Pictures.json');


function uintRandom(int) {
    return Math.round(Math.random() * (int - 1));
}

const aliveRooms = () => {
    return Rooms.map((r, index) =>
        Object.assign(r, {
            userId: Users[index]._id,
            picture: Pictures[uintRandom(11)]
        })
    );
};

const aliveUsers = () => {
    return Users.map((u, index) =>
        Object.assign({}, u, {
            roomId: Rooms[index]._id
        })
    );
};

const aliveStuffs = () => {
    return Stuffs.map((s, index) =>
        Object.assign({}, s, {
            roomId: Rooms[index % 50]._id
        })
    );
};

const savePictures = () => {
    let index = 0;
    const files = {};
    return new Promise( (resolve, reject) => {
        const addFile = (index) => {
            this.ipfs.files.add({
                path: `pictures/${index}.png`,
                content: fs.createReadStream(`./pictures/${index}.png`)
            }).then( files => {
                index++;
                console.log(file);
                files[index] = file.hash;
                if( index = 8 ) return resolve(files);
                console.log(addFile);
                addFile(index);
            } );
        }
        addFile(index);
    });
};

const randomOrderStuff = () => {
    const stuffs = [];
    for (let i = 0; i < uintRandom(10); i++) {
        stuffs.push(Stuffs[uintRandom(150)]._id);
    }
    return stuffs;
};

// order generated per room, per day
const aliveOrders = ( roomId ) => {
    return Orders.map(o =>
        Object.assign({}, o, {
            stuffIds: randomOrderStuff(),
            clientId: Users[uintRandom(50)]._id,
            roomId: "563a6c40-3720-11e7-80eb-bb3b498293d1",
            created: Moment().startOf("days").add(uintRandom(24 * 60), "minutes").unix(),
            treated: this.created < Moment().unix
        })
    ).sort( (a, b) => a.created > b.created ? 1 : 0 )
};

program
    .arguments("<file>")
    .option("-p, --populate", "Populate ipfs right away")
    .option("-d, --drop", "Drop the database")
    .option("-rId, --roomId <roomId>", "In case of generating orders, the room that will get those orders")
    .action(file => {
        switch (file) {
            case "order":
                console.log("...generating orders");
                const orders = aliveOrders(program.roomId)
                fs.writeFile(path.resolve(__dirname, "Order.json"), JSON.stringify(orders), err => {
                    if (err) console.log("error", err);
                    if (!program.drop && !program.populate) process.exit();
                });
                break;
            case "user":
                console.log("...regenerating users");
                const users = aliveUsers();
                fs.writeFile(path.resolve(__dirname, "User.json"), JSON.stringify(users), err => {
                    if (err) console.log("error", err);
                    if (!program.drop && !program.populate) process.exit();
                });
                break;
            case "stuff":
                console.log("...regenerating stuffs");
                const stuffs = aliveStuffs();
                fs.writeFile(path.resolve(__dirname, "Stuff.json"), JSON.stringify(stuffs), err => {
                    if (err) console.log("error", err);
                    if (!program.drop && !program.populate) process.exit();
                });
                break;
            case "room":
                console.log("...regenerating rooms");
                const rooms = aliveRooms();
                fs.writeFile(path.resolve(__dirname, "Room.json"), JSON.stringify(rooms), err => {
                    if (err) console.log("error", err);
                    if (!program.drop && !program.populate) process.exit();
                });
                break;
            case "picture":
                savePictures().then( files => {
                    fs.writeFile(path.resolve(__dirname, "Picture.json"), JSON.stringify(files), err => {
                        if (err) console.log("error", err);
                        if (!program.drop && !program.populate) process.exit();
                    });
                })
            default:
                break;
        }
    })
    .parse(process.argv);
