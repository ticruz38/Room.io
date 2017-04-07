import { observable } from 'mobx';
import { EventEmitter } from 'events';

// stream
import * as through from 'through2';
import * as concat from 'concat-stream';

const IpfsDaemon = require('./IpfsDaemon');
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
        this.startOrbitDb().then( _ => {
            this.createDb('room');
            this.createDb('stuff');
            this.createDb('user', 'email');
            this.createDb('order');
        } );
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
                    // reader.onloadend = ( e ) => resolve(reader.result)
                    // console.log(file);
                    // let chunks = ''
                    // console.log(files[0].content);
                    // for (let i = 0; i < files[0].content.length; i+=10000) {
                    //     const list = files[0].content.slice(i, i+10000);
                    //     chunks = chunks + btoa( String.fromCharCode.apply(null, list) );
                    // }
                    // console.log(chunks);
                    // resolve(chunks);
                    // console.log( files[0].content )
                    // resolve(files[0].content.map( s => btoa( String.fromCharCode.apply(null, [s]) ) ) );
                    resolve( btoa( String.fromCharCode.apply(null, files[0].content) ) );
                    // console.log(files);
                } ) )
            } );
        } );
    }

    // ipfs.files.get(mhBuf, (err, stream) => {
    //       expect(err).to.not.exist()

    //       let files = []
    //       stream.pipe(through.obj((file, enc, next) => {
    //         file.content.pipe(concat((content) => {
    //           files.push({
    //             path: file.path,
    //             content: content
    //           })
    //           next()
    //         }))
    //       }, () => {
    //         expect(files).to.be.length(1)
    //         expect(files[0].path).to.be.eql(hash)
    //         expect(files[0].content.toString()).to.contain('Plz add me!')
    //         done()
    //       }))
    //     })

    // getImage( hash: string ): Promise< string > {
    //     return new Promise( (resolve, reject) => {
    //         this.ipfs.files.get( hash, (err, stream) => {
    //             stream.pipe( through.obj( (file, enc, next) =>
    //                 file.content.pipe( concat( (content) => {
    //                     resolve( btoa( String.fromCharCode.apply(null, content) ) );
    //                     next();
    //                 } ) )
    //             ) )
    //         } );
    //     } );
    // }

    createDb(dbName: string, indexBy?: string ) {
        // console.log('createdb', this.orbitdb);
        this[dbName] = new Promise( (resolve, reject) => {
            const db = this.orbitdb.docstore(dbName, {indexBy: indexBy || '_id'});
            db.events.on('ready', _ => {
              resolve(db);
              logger.info('db ' + dbName + ' ready')
            } );
            db.events.on('load', _ => logger.info('db ' + dbName + ' syncing with ipfs' ) );
        } );
    }

    startOrbitDb() {
        // IpfsApi is a bridge to the local ipfs client node
        const ipfs = new IpfsDaemon({
            IpfsDataDir: '/datadir',
            SignalServer: 'star-signal.cloud.ipfs.team'
        });
        // nodeId is the ipfs node identifier
        // this.nodeID = this.ipfs.id().then( (config: any) => this.nodeID = config.id );
        return new Promise( (resolve, reject) => {
            ipfs.on('ready', () => {
                console.log('ready', ipfs);
                this.ipfs = ipfs;
                this.orbitdb = new Orbitdb( ipfs );
                resolve();
            } );
        } );
    }
}

export default new IpfsStore();
