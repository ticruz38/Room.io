// stream
const through = require('through2');
const concat = require('concat-stream');

const IpfsApi = require('@haad/ipfs-api')

// const aemon require('./IpfsDaemon');

const Orbitdb = require('orbit-db');
const Logger = require('logplease');

const logger = Logger.create('Ipfs-server');

class IpfsStore {
    constructor() {
        this.startOrbitDb();
        this.createDb('room');
        this.createDb('stuff');
        this.createDb('user', 'email');
        this.createDb('order');
    }

    uploadFile( input, cb ) {
        const reader = new FileReader();
        reader.readAsArrayBuffer( input );
        reader.onloadend = ( e ) => {
            this.ipfs.files.add( new Buffer( reader.result ), (err, res) => {
                if(err) throw 'file couldnt be upload to ipfs' + input
                cb( err, res );
            } );
        }
    }

    getImage( hash ) {
        return new Promise( (resolve, reject) => {
            this.ipfs.files.get( hash, (err, stream) => {
                console.log(hash);
                if( err ) throw err;
                let files = [];
                stream.pipe( through.obj( (file, enc, next) => {
                    file.content.pipe( concat( (content) => {
                        files.push( {
                            path: file.path,
                            content: content
                        } )
                        next();
                    } ) )
                }, () => {
                    // the blob is invalid maybe because it is encoded as json...
                    const file = new Blob( files[0].content, {type: 'image/jpg'} );
                    // console.log(file);
                    const reader = new FileReader();
                    reader.readAsDataURL(file)
                    // reader.onloadend = e => resolve(reader.result);
                    resolve( btoa( String.fromCharCode.apply(null, files[0].content) ) );
                } ) )
            } );
        } );
    }

    createDb(dbName, indexBy ) {
        console.log('createDb', dbName);
        this[dbName] = new Promise( (resolve, reject) => {
            const db = this.orbitdb.docstore(dbName, {indexBy: indexBy || '_id'});
            db.events.on('ready', _ => {
              resolve(db);
              logger.info('db ' + dbName + ' ready')
            } );
            db.events.on('load.start', _ => console.log('load starting'));
            db.events.on('load', _ => console.log('load starting'));
            db.events.on('sync', _ => logger.info('db ' + dbName + ' syncing with ipfs' ) );
        } );
    }

    startOrbitDb() {
        // IpfsApi is a bridge to the local ipfs client node
        this.ipfs = new IpfsApi();
        // nodeId is the ipfs node identifier
        this.nodeID = this.ipfs.id().then( config => this.nodeID = config.id );
         // We instantiate Orbit-db with our ipfs client node
        this.orbitdb = new Orbitdb( this.ipfs, "default", { ipns: "QmRiVcrZ7Jibn5CddvwE4UCGvQkDALy3e1h8aEUxu9PbcG" } );
    }
}

module.exports = new IpfsStore();
