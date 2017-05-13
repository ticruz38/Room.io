import * as OrbitDB from 'orbit-db';
import * as Ipfs from 'ipfs';

const dbs = ['user', 'order', 'room', 'stuff'];

const roomDataRequest = 'roomio:data:request';
const roomDataUpdate = 'roomio:data:update';


//TODO Make it listening to sinced db events and notify the guardian about the new hash
export default class Web3DB extends OrbitDB {
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
                Object.keys(cache)
                console.info('guardnode responded with cache', cache);
                // if the db is not cached yet resolve immediately
                dbs.map(db => Object.keys( cache ).find( key => key === db ) || this.stores[db].events.emit('loaded', db) );
                Object.keys( cache ).map( key => {
                    this.stores[key]._cache.set(key, cache[key]).then(_ => {
                        // reload the database with the new cache
                        this.stores[key].load().then( _ => {
                            this.stores[key].events.emit('loaded', 'room');
                        })
                        this.stores[key].load(1).then( _ => {
                            // we need to listen to events in order to refresh room count in the view
                            let index = 0;
                            const loadMore = () => {
                                index++;
                                this.stores[key].loadMore(1).then( _ => {
                                    if(index > 50) {
                                        this.stores[key].load(); // load any other items
                                        return;
                                    };
                                    loadMore()
                                });
                            }
                            loadMore();
                        });
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

        this.stores[dbname] = store

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
    // _onSync(dbName) {
    //     const dbHash = this.stores[dbName]._cache._cache;
    //     console.log('.ONSync', dbHash);
    //     this._ipfs.pubsub.publish(roomDataUpdate, new Buffer(JSON.stringify(dbHash)));
    // }
}