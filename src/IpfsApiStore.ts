import { observable } from 'mobx';
import Schema from './graphql-client/Root';

const Orbitdb = require('orbit-db');
const IpfsApi = require('@haad/ipfs-api');


class IpfsStore {
    nodeID: string;
    orbitdb: any;
    node: any;
    room: Promise< any >;
    stuff: Promise< any >;
    user: Promise< any >;
    chat: any;

    constructor() {
        this.startOrbitDb();
        this.createDb('room');
        this.createDb('stuff');
        this.createDb('user', 'email');
    }

    // roomLoaded number between 0 and 1
    roomLoading: number = 0;

    // stuffLoaded number between 0 and 1
    stuffLoading: number = 0;

    createDb(dbName: string, indexBy?: string ) {
        this[dbName] = new Promise( (resolve, reject) => {
            const db = this.orbitdb.docstore(dbName, {indexBy: indexBy || '_id'});
            db.events.on('ready', _ => {
              resolve(db);
              console.log('db ' + dbName + ' ready')
            } );
            db.events.on('load', _ => console.log('db ' + dbName + ' syncing with ipfs' ) );
        } );
    }

    startOrbitDb() {
        // IpfsApi is a bridge to the local ipfs client node
        this.node = new IpfsApi();
        // nodeId is the ipfs node identifier
        this.nodeID = this.node.id().then( (config: any) => this.nodeID = config.id );
         // We instantiate Orbit-db with our ipfs client node
        this.orbitdb = new Orbitdb( this.node );
    }
}

export default new IpfsStore();
