#!/usr/bin/env node --harmony
const fs = require("fs");
var path = require("path");
const Moment = require("moment");
const program = require("commander");

const Orders = require("./Order.json");
const Rooms = require("./Room.json");
const Stuffs = require("./Stuff.json");
const Users = require("./User.json");

function uintRandom(int) {
    return Math.round(Math.random() * (int - 1));
}

const aliveRooms = () => {
    return Rooms.map((r, index) =>
        Object.assign(r, {
            userId: Users[index]._id
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

const randomOrderStuff = () => {
    const stuffs = [];
    for (let i = 0; i < uintRandom(10); i++) {
        stuffs.push(Stuffs[uintRandom(150)]._id);
    }
    return stuffs;
};

// order generated per room, per day
const aliveOrders = roomName => {
    return new Promise((resolve, reject) => {
        const roomId = new Promise((s, f) => {
            if (!program.roomName) return s(Rooms[0]._id);
            Store.order.then(dbOrder => {
                s(dbOrder.query(o => o.name === roomName)[0]._id);
            });
        });
        roomId.then(id => {
            resolve(
                Orders.map(o =>
                    Object.assign({}, o, {
                        stuffIds: randomOrderStuff(),
                        clientId: Users[uintRandom(50)]._id,
                        roomId: id,
                        created: Moment().startOf("days").add(uintRandom(24 * 60), "minutes").unix(),
                        treated: this.created < Moment().unix
                    })
                )
            );
        });
    });
};

program
    .arguments("<file>")
    .option("-p, --populate", "Populate ipfs right away")
    .option("-d, --drop", "Drop the database")
    .option("-rName, --roomName <roomName>", "In case of generating orders, the room that will get those orders")
    .action(file => {
        switch (file) {
            case "order":
                console.log("...generating orders", program.drop);
                aliveOrders(program.roomName).then(orders => {
                    fs.writeFile(path.resolve(__dirname, "Order.json"), JSON.stringify(orders), err => {
                        if (err) console.log("error", err);
                        if (!program.drop && !program.populate) process.exit();
                    });
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
            default:
                break;
        }
    })
    .parse(process.argv);
