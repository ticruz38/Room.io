import * as OrbitDB from 'orbit-db';
import * as Ipfs from 'ipfs';

const roomDataRequest = 'roomio:data:request';
const roomDataUpdate = 'roomio:data:update';


//TODO Make it listening to sinced db events and notify the guardian about the new hash
export default class Web3DB extends OrbitDB {
    plugging: Promise<any>
    constructor(ipfs: Ipfs) {
        super(ipfs);
        window['web3'] = ipfs;
        this.requestDataToGuard();
    }
    // plug the node to the roomio network to subscribe to generic network events
    requestDataToGuard() {
        this._ipfs.id().then(peer => {
            this._ipfs.swarm.connect('/ip4/127.0.0.1/tcp/4003/ws/ipfs/QmXNgnNG5hdshrggnJ2GvhdE6p6LY6imhqP3vE9uDHZ21S', (err) => {
                if (err) return console.error(err);
                console.log('you just connected to the guardnode');
                this._ipfs.swarm.peers((err, peerInfos) => console.log(peerInfos));
                // for some reason we need to set a setTimeout...
                setTimeout(_ => this._ipfs.pubsub.publish(roomDataRequest, new Buffer(peer.id)), 100);
            });
            this._ipfs.pubsub.subscribe(peer.id, message => {
                const cache = JSON.parse(message.data.toString());
                console.info('guardnode responded with cache', cache);
                Object.keys( cache ).map( key => {
                    this.stores[key]._cache.set(key, cache[key]).then(_ => {
                        // reload the database with the new cache
                        console.log('reloading database?') // yes but block is unfindable since it's not stocked in any repo neither this neither guardnode
                        // this.stores[key].load();
                    })
                })
            })
        })
    }

    /* Private methods to be overriden to subscribe to the sync event as well*/
    _createStore(Store, dbname, options) {
        const opts = Object.assign({ replicate: true }, options)

        const store = new Store(this._ipfs, this.user.id, dbname, opts)
        store.events.on('write', this._onWrite.bind(this))
        store.events.on('ready', this._onReady.bind(this))
        store.events.on('synced', this._onSync.bind(this))

        this.stores[dbname] = store
        // store.load(50);

        if (opts.replicate && this._pubsub)
            this._pubsub.subscribe(dbname, this._onMessage.bind(this))

        return store
    }

    /* Data events */
    _onWrite(dbname, hash, entry, heads) {
        // 'New entry written to database...', after adding a new db entry locally
        console.log(".WROTE", dbname, hash)
        if (!heads) throw new Error("'heads' not defined")
        if (this._pubsub) setImmediate(() => {
            this._pubsub.publish(dbname, heads)
            this._ipfs.pubsub.publish(roomDataUpdate, new Buffer( JSON.stringify( {[dbname]: hash} ) ) );
        } )
    }

    // Notify the guard about the new hash
    _onSync(dbName) {
        const dbHash = { [dbName]: this.stores[dbName]._cache[dbName] }
        console.log('.ONSync', dbHash);
        this._ipfs.pubsub.publish(roomDataUpdate, new Buffer(JSON.stringify(dbHash)));
    }
}