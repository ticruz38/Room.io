import * as OrbitDB from 'orbit-db';
import * as Ipfs from 'ipfs';
import { uniq } from './utils';
import { Connect } from 'uport-connect'
import dbContract from './DbContract';

const database = require('/Users/tduchene/Code/truffle/build/contracts/DataBase.json');
const contract = require('truffle-contract');
const dbs = ['user', 'order', 'room', 'stuff'];

const ROOMDATAREQUEST = 'roomio:data:request';
const ROOMDATAUPDATE = 'roomio:data:update';
const PEERS = 'peers';

//TODO Make it listening to sinced db events and notify the guardian about the new hash
export default class Web3DB extends OrbitDB {
    _peers: string[] = [];
    web3: any // ethereum connector
    account: string //ethereum account address
    dbContract: any;

    constructor(ipfs: Ipfs, public peerId: string ) {
        super(ipfs);
        window['ipfs'] = ipfs;
        // subscribe to a common chanel for all active peers in the app
        this._ipfs.pubsub.subscribe(PEERS, () => null);
        // this.web3 = uport.getWeb3();
        // this.syncWithContract();
    }

    startUp(cb) {
        return dbContract().then(({instance, credentials}) => {
            this.dbContract = instance;
            this.account = credentials.address;
            this._syncWithContract();
            this._listenToContract();
            cb(null, credentials);
        }).catch(error => cb(error, null));
    }

    _listenToContract() {
        const dbUpdate = this.dbContract.dbUpdate();
        dbUpdate.watch((err, result) => {
            if (err) return console.log(err);
            // console.log('dbUpdate watched');
            // update cache hash and reload store
            this._pubsub.publish(result.collection, result.collectionHash);
        });
        const newConnection = this.dbContract.peerAdded();
        newConnection.watch((err, peer) => {
            const newPeer = peer.args.ipfsHash;
            this._connectWithPeers([newPeer, ...this._peers]);
        });
        // get the last connection forwarded by the event
        newConnection.get((err, peers) => {
            console.log(peers);
            const newPeers = peers.map(p => p.args.ipfsHash);
            this._connectWithPeers(newPeers);
        });
    }
    //notify the contract about a new connection and get the latests collection hash
    _syncWithContract() {
        // I wish I could just make a call, but then the event is'nt triggered
        this.dbContract.addPeer(this.peerId, { from: this.account, gas: 210000 })
            .then(result => console.log('addPeer', result))
            .catch(err => console.log(err))
        dbs.map( db => 
            this.dbContract.getCollection.call(db).then(dbHash => {
                console.log(db, dbHash);
                this._loadStore(db, dbHash);
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
            console.log(this.account, dbname, hash);
            window["web3"].eth.getBalance( this.account, (err, result) => console.log(result.toString(10)));
            this.dbContract.saveCollection(dbname, hash, { from: this.account, gas: 210000 })
            .then( transaction => console.log(transaction))
            .catch( error => console.log(error))
            // notify the blockchain about new entry
            // this._pubsub.publish(dbname, heads);
        });
    }
}