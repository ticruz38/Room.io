import * as ipfs from 'ipfs';
import * as events from 'events';

export as namespace OrbitDB

/// <reference types="ipfs" />

export = OrbitDB;

declare class OrbitDB {
    _ipfs: ipfs;
    _pubsub: OrbitDB.Pubsub;
    user: {id: string};
    network: {name: string};
    events: events.EventEmitter;
    stores: {[key: string]: any};

    constructor( ipfs: ipfs, id?: string, options?: OrbitDB.Options );

    feed(dbname: string, options?: Object): OrbitDB.Store;
    eventlog(dbname: string, options?: Object): OrbitDB.Store;
    kvstore(dbname: string, options?: Object): OrbitDB.Store;
    counter(dbname: string, options?: Object): OrbitDB.Store;
    docstore(dbname: string, options?: Object): OrbitDB.Store;
    disconnect();
    
    _createStore( Store: OrbitDB.Store, dbname: string, options: OrbitDB.Store.Options ): OrbitDB.Store;
    _onMessage(dbname: string, hash: string)
    _onWrite(dbname: string, hash: string)
    _onReady(dbname: string, items: Object)
}


declare namespace OrbitDB {
    export interface Options {
        broker: any,
    }

    class Pubsub {
        _ipfs: ipfs;
        _subscriptions: {};
        constructor(ipfs: ipfs);
        subscribe(hash: string, onMessageCallback: Function )
        unsubscribe(hash: string)
        publish(hash: string, message: any)
        disconnect()
        _handleMessage(message: any)
    }

    export namespace Pubsub {

    }

    export class Store {
        constructor()
        options: Store.Options
    }

    export namespace Store {
        export interface Options {
            subscribe: boolean;
        }
    }
}