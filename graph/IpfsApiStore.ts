import { observable } from 'mobx';
import { EventEmitter } from 'events';

// stream
import * as through from 'through2';
import * as concat from 'concat-stream';

const IpfsApi = require('@haad/ipfs-api')

// import IpfsDaemon from './IpfsDaemon';

const Orbitdb = require('orbit-db');
const Logger = require('logplease');

const logger = Logger.create('Ipfs-server');

class IpfsStore {
    nodeID: string;
    orbitdb: any;
    ipfs: any;
    room: Promise< any >;
    stuff: Promise< any >;
    user: Promise< any >;
    order: Promise< any >;
    chat: any;
    pubsub = new EventEmitter();

    constructor() {
        this.startOrbitDb();
        this.createDb('room');
        this.createDb('stuff');
        this.createDb('user', 'email');
        this.createDb('order');
    }

    // roomLoaded number between 0 and 1
    roomLoading: number = 0;

    // stuffLoaded number between 0 and 1
    stuffLoading: number = 0;

    uploadFile(input, cb?: Function) {
        const reader = new FileReader();
        reader.readAsArrayBuffer( input );
        reader.onloadend = ( e ) => {
            this.ipfs.files.add( new Buffer( reader.result ), (err, res) => {
                if(err) throw 'file couldnt be uploaded to ipfs' + input
                cb(err, res);
            } );
        }
    }

    getImage( hash: string ): Promise< string > {
        return new Promise( (resolve, reject) => {
            this.ipfs.files.get( hash, (err, stream) => {
                let files = [];
                stream.pipe( through.obj( (file, enc, next) => {
                    file.content.pipe( concat( (content) => {
                        // resolve( btoa( String.fromCharCode.apply(null, content) ) );
                        files.push( {
                            path: file.path,
                            content: content
                        } )
                        next();
                    } ) )
                }, () => {
                    // the blob is invalid maybe because it is encoded as json...
                    const file = new Blob( files[0].content, {type: 'image/jpg'} );
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    resolve( btoa( String.fromCharCode.apply(null, files[0].content) ) );
                } ) )
            } );
        } );
    }

    createDb(dbName: string, indexBy?: string ) {
        this[dbName] = new Promise( (resolve, reject) => {
            const db = this.orbitdb.docstore(dbName, {indexBy: indexBy || '_id'});
            console.log('docstore')
            window[dbName] = db;
            db.events.on('ready', _ => {
              resolve(db);
              logger.info('db ' + dbName + ' ready')
            } );
            db.events.on('sync', _ => logger.info('db ' + dbName + ' syncing with ipfs' ) );
        } );
    }

    startOrbitDb() {
        // IpfsApi is a bridge to the local ipfs client node
        this.ipfs = new IpfsApi();
        console.log(this.ipfs);
        // nodeId is the ipfs node identifier
        this.nodeID = this.ipfs.id().then( (config: any) => this.nodeID = config.id );
         // We instantiate Orbit-db with our ipfs client node
        this.orbitdb = new Orbitdb( this.ipfs );
    }
}

export default new IpfsStore();
