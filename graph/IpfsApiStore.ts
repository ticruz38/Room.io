import { EventEmitter } from 'events';

// stream
import * as through from 'through2';
import * as concat from 'concat-stream';
import * as Ipfs from 'ipfs';
import Web3DB from './Web3DB';


// import IpfsDaemon from './IpfsDaemon';
const Logger = require('logplease');

const logger = Logger.create('Ipfs-server');

class IpfsStore {
    web3DB: any; // layer on top of orbitdb
    ipfs: any;
    pubsub = new EventEmitter();
    bootingDb: Promise<any> = this.startWeb3DB();
    room: Promise<any> = this.createDb('room');
    stuff: Promise<any> = this.createDb('stuff');
    user: Promise<any> = this.createDb('user');
    order: Promise<any> = this.createDb('order');

    get starting(): Promise<any> {
        return Promise.all([
            this.room,
            this.stuff,
            this.user,
            this.order
        ])
    }

    uploadFile(input, cb?: (err, res: any) => void) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(input);
        reader.onloadend = (e) => {
            this.ipfs.files.add(new Buffer(reader.result), (err, res) => {
                if (err) throw 'file couldnt be upload to ipfs' + input
                cb(err, res);
            });
        }
    }

    getImage(hash: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ipfs.files.get(hash, (err, stream) => {
                if (err) throw err;
                let files = [];
                stream.pipe(through.obj((file, enc, next) => {
                    file.content.pipe(concat((content) => {
                        files.push({
                            path: file.path,
                            content: content
                        })
                        next();
                    }))
                }, () => {
                    // the blob is invalid maybe because it is encoded as json...
                    const file = new Blob(files[0].content, { type: 'image/jpg' });
                    // console.log(file);
                    const reader = new FileReader();
                    reader.readAsDataURL(file)
                    // reader.onloadend = e => resolve(reader.result);
                    resolve(btoa(String.fromCharCode.apply(null, files[0].content)));
                }))
            });
        });
    }

    createDb(dbName: string, indexBy?: string): Promise<any> {
        console.log('createDb', dbName);
        return new Promise((resolve, reject) => {
            this.bootingDb.then(_ => {
                const db = this.web3DB.docstore(dbName, { indexBy: indexBy || '_id' });
                console.log(db);
                db.load(150); // to fetch current ipfs repo
                window[dbName] = db;
                db.events.on('ready', message => {
                    resolve(db);
                    logger.info('db ' + dbName + ' ready ' + message)
                });
                db.events.on('sync', _ => logger.info('db ' + dbName + ' starting'));
            })
            // return db.load().then( message => logger.info( 'db ' + dbName + ' ready ' + message ));
        });
    }

    startWeb3DB(): Promise<any> {
        this.ipfs = new Ipfs({ EXPERIMENTAL: { pubsub: true } });
        return new Promise((resolve, reject) => {
            this.ipfs.on('ready', () => {
                // We instantiate Orbit-db with our ipfs client node
                this.web3DB = new Web3DB(this.ipfs);
                resolve();
            })
            this.ipfs.on('error', (err) => reject(err))
        })
    }
}

export default new IpfsStore();
