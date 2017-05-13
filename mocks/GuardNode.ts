import * as Ipfs from 'ipfs';

const Cache = require('orbit-db-cache');

const roomDataRequest = 'roomio:data:request';
const roomDataUpdate = 'roomio:data:update';
const collections = ['room', 'stuff', 'user', 'order'];


class GuardNode {
    _cache: any;
    constructor(public ipfs: Ipfs, public collections: string[]) {
        this._cache = new Cache('roomio');
        this._listenToUpdate();
        this._listenToRequest();
    }

    _listenToRequest() {
        this.ipfs.pubsub.subscribe(roomDataRequest, message => {
            const nodeId = message.data.toString();
            console.info('Got data request from ' + nodeId);
            this.ipfs.pubsub.publish(nodeId, new Buffer(JSON.stringify(this._cache._cache)))
        })
    }

    // Listening to table update, and update the cash
    _listenToUpdate() {
        this.ipfs.pubsub.subscribe(roomDataUpdate, message => {
            const tableHash = JSON.parse(message.data.toString());
            const table = Object.keys(tableHash)[0];
            const hash = tableHash[table];
            console.info('got new hash for table ' + table + ' with hash ' + hash);
            this._cache.set(table, hash);
            // we also need to keep all the block....
            this.ipfs.object.get(hash, { enc: 'base58' })
                .then((dagNode) => JSON.parse(dagNode.toJSON().data))
                .then((logData) => {
                    console.log('logData', logData);
                    logData.heads.map(hash => {
                        this.ipfs.object.get(hash, { enc: 'base58' })
                            .then((dagNode) => JSON.parse(dagNode.toJSON().data))
                            .then((logData) => console.log('sub - logData', logData))
                    })
                })
        })
    }
}

// should i init the node to be able to put and pull object?
// May I start it in another directory ?
const ipfs = new Ipfs({ EXPERIMENTAL: { pubsub: true } });

ipfs.on('ready', () => {
    new GuardNode(ipfs, collections)
})

ipfs.on('error', () => { console.log('error') }) // Node has hit some error while initing/starting