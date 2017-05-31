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
        window['web3DB'] = this;
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
            // update cache hash and reload store
            // sorry the collection is the hash, the hash is the collection, neet ot fix this in the contract
            this._onMessage(result.args.hash, result.args.collection);
        });
    }

    reset(dbName, hash?: string) {
        this.dbContract.saveCollection(dbName, hash || "", { from: this.account, gas: 210000 })
            .then( transaction => console.log(transaction))
            .catch( error => console.log(error))
    }

    //notify the contract about a new connection and get the latests collection hash
    _syncWithContract() {
        // I wish I could just make a call, but then the event is'nt triggered
        dbs.map( db => 
            this.dbContract.getCollection.call(db).then(dbHash => {
                console.log(db, dbHash);
                this._loadStore(db, dbHash);
            })
        )
    }

    _loadStore(dbName, dbHash) {
        if (!dbHash.length) return this.stores[dbName].events.emit('loaded', dbName);
        this.stores[dbName]._cache.set(dbName, dbHash).then(_ => {
            this.stores[dbName].load();
            // load items one by one
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

        return store
    }

    /* Data events */
    _onWrite(dbname, hash, entry, heads) {
        // 'New entry written to database...', after adding a new db entry locally
        if (!heads) throw new Error("'heads' not defined");
        //@TODO check if the previous ownerAddress block match the account
        // if not throw an error, ownerAddress shouldnt be mutated
        setImmediate(() => {
            this.dbContract.saveCollection(dbname, hash, { from: this.account, gas: 210000 })
            .then( transaction => console.log(transaction))
            .catch( error => console.log(error))
            // notify the blockchain about new entry
            // this._pubsub.publish(dbname, heads);
        });
    }
}