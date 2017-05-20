import * as OrbitDB from 'orbit-db';
import * as Ipfs from 'ipfs';
import { uniq } from './utils';

const dbs = ['user', 'order', 'room', 'stuff'];

const ROOMDATAREQUEST = 'roomio:data:request';
const ROOMDATAUPDATE = 'roomio:data:update';
const PEERS = 'peers';


//TODO Make it listening to sinced db events and notify the guardian about the new hash
export default class Web3DB extends OrbitDB {
    _peers: string[] = [];

    constructor(ipfs: Ipfs, public dbContract: any, public account: string, public peerId: string) {
        super(ipfs);
        window['web3'] = ipfs;
        // subscribe to a common chanel for all active peers in the app
        this._ipfs.pubsub.subscribe(PEERS, () => null);
        this.listenToContract();
        this.syncWithContract();
    }

    listenToContract() {
        const dbUpdate = this.dbContract.dbUpdate();
        dbUpdate.watch((err, result) => {
            if (err) return console.log(err);
            console.log('dbUpdate watched');
            // update cache hash and reload store
            this._pubsub.publish(result.collection, result.hash);
        });
        const newConnection = this.dbContract.peerAdded();
        newConnection.watch((err, peer) => {
            const newPeer = peer.args.ipfsHash;
            this._connectWithPeers([newPeer, ...this._peers]);
        });
        // get the last connection forwarded by the event
        newConnection.get((err, peers) => {
            const newPeers = peers.map(p => p.args.ipfsHash);
            this._connectWithPeers(newPeers);
        });
    }
    //notify the contract about a new connection and get the latests collection hash
    syncWithContract() {
        // I wish I could just make a call, but then the event is'nt triggered
        this.dbContract.addPeer(this.peerId, { from: this.account })
            .then(result => console.log('addPeer', result))
            .catch(err => console.log(err))
        dbs.map(dbName =>
            this.dbContract.getCollection.call(dbName, { from: this.account }).then(dbHash => {
                this._loadStore(dbName, dbHash);
            })
        )
    }

    _openConnection(addr) {
        this._ipfs.swarm.connect(addr, (err) => {
            if (err) return console.error(err);
            console.log('opened connection with ' + addr);
        });
    }

    _connectWithPeers(peers) {
        console.log(peers);
        this._ipfs.pubsub.peers(PEERS, (err, peersConnected) => {
            if (err) return console.error(err);
            let newPeers = peers.filter(pId => !this._peers.find(id => id === pId));
            this._peers = uniq([...peers, ...peersConnected]);
            newPeers.map(pId => this._openConnection('/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss/ipfs/' + pId));
        })
    }

    _loadStore(dbName, dbHash) {
        console.log('loadStore', dbName, dbHash);
        if (!dbHash.length) return this.stores[dbName].events.emit('loaded', dbName);
        this.stores[dbName]._cache.set(dbName, dbHash).then(_ => {
            this.stores[dbName].load();
            this.stores[dbName].load(1).then(_ => {
                let index = 0;
                const loadMore = () => {
                    index++;
                    this.stores[dbName].loadMore(1).then(_ => {
                        if (index > 50) {
                            this.stores[dbName].events.emit('loaded', 'room');
                            // this.stores[key].load(); // load any other items
                            return;
                        };
                        loadMore();
                    });
                }
                loadMore();
            });
        })
    }

    /* Private methods to be overriden to subscribe to the sync event as well*/
    _createStore(Store, dbname, options) {
        const opts = Object.assign({ replicate: true }, options)

        const store = new Store(this._ipfs, this.user.id, dbname, opts)
        store.events.on('write', this._onWrite.bind(this))
        store.events.on('ready', this._onReady.bind(this))

        this.stores[dbname] = store;

        if (opts.replicate && this._pubsub)
            this._pubsub.subscribe(dbname, this._onMessage.bind(this))

        return store
    }

    /* Data events */
    _onWrite(dbname, hash, entry, heads) {
        // 'New entry written to database...', after adding a new db entry locally
        console.log(".WROTE", dbname, hash, heads, this.account);
        if (!heads) throw new Error("'heads' not defined");
        //@TODO check if the previous ownerAddress block match the account
        // if not throw an error, ownerAddress shouldnt be mutated
        if (this._pubsub) setImmediate(() => {
            this.dbContract.saveCollection(dbname, hash, { from: this.account })
            // notify the blockchain about new entry
            // this._pubsub.publish(dbname, heads);
        });
    }
}