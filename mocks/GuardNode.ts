import * as Ipfs from 'ipfs';

const Cache = require('orbit-db-cache');

const ROOMDATAREQUEST = 'roomio:data:request';
const ROOMDATAUPDATE = 'roomio:data:update';
const PEERS = 'peers';
const collections = ['room', 'stuff', 'user', 'order'];


class GuardNode {
    _cache: any;
    _peers: string[] = []; // keep a copy of all peers connected to the application
    constructor(public ipfs: Ipfs, public collections: string[]) {
        this._cache = new Cache('roomio');
        this._listenToUpdate();
        this._listenToRequest();
        setInterval(_ => this._refreshPeersConnected(), 1000); // refresh peers list every seconds
    }

    _listenToRequest() {
        this.ipfs.pubsub.subscribe(ROOMDATAREQUEST, message => {
            const nodeId = message.data.toString();
            this.ipfs.pubsub.publish(nodeId, new Buffer(JSON.stringify(this._cache._cache)))
        })
    }

    _refreshPeersConnected() {
        this.ipfs.pubsub.peers(PEERS, (err, peerIds) => {
            if (err) {
                throw err
            }
            if (this._peers.length !== peerIds.length ) console.log('topic peers', peerIds);
            console.log(peerIds);
            this.ipfs.pubsub.publish(PEERS, new Buffer(JSON.stringify(peerIds)))
        })
        // this.ipfs.swarm.peers((err, peerInfos) => {
        //     if(err) return console.log(err);
        //     console.log( peerInfos.find( p => p.peer.id._idB58String === 'QmanXqQQGZUtUvHtEForPnZvNpoH1Yvt7aG2M9YQH3Buoa') );
        // })
    }

    // Listening to table update, and update the cash
    _listenToUpdate() {
        this.ipfs.pubsub.subscribe(ROOMDATAUPDATE, message => {
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