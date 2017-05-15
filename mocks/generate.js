const Orders = require("./Order.json");
const Rooms = require("./Room.json");
const Stuffs = require("./Stuff.json");
const Users = require("./User.json");

import Store from "graph/IpfsApiStore";

export function uintRandom(int) {
    return Math.round(Math.random() * (int - 1));
}

function getRandomData(dbName) {
    switch (dbName) {
        case "order":
            return Orders;
        case "room":
            return Rooms;
        case "stuff":
            return Stuffs;
        case "user":
            return Users;
    }
}

export const DropDb = dbName => {
    return new Promise((resolve, reject) => {
        Store[dbName].then(db => {
            console.log(dbName + " database ready, deleting items");
            const dbItems = db.query(o => !!o);
            if (!dbItems.length) {
                console.log("there is no items in " + dbName);
                resolve();
            }
            let index = 0;
            const deleteItem = (index) => {
                db.del(dbItems[index]._id).then(removed => {
                    console.log("removed " + removed._id);
                    index++;
                    if (index > 49) return;
                    deleteItem(index);
                });
            };
            deleteItem(0);
        });
    });
};

export const PopulateDb = dbName => {
    const dbItems = getRandomData(dbName);
    Store[dbName].then(db => {
        console.log(dbName + " database ready, adding items");
        let index = 0;
        const populateItems = (index) => {
            const item = dbItems[index];
            db.put(item).then(hash => {
                console.log("added " + dbName + item._id + " with hash " + hash);
                index++;
                if (index === dbItems.length - 1) return;
                populateItems(index);
            });
        };
        populateItems(index);
    });
};
