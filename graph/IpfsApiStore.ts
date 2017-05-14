import { EventEmitter } from 'events';

// stream
import * as through from 'through2';
import * as concat from 'concat-stream';
import * as Ipfs from 'ipfs';
import Web3DB from './Web3DB';


// import IpfsDaemon from './IpfsDaemon';
const Logger = require('logplease');

const logger = Logger.create('Ipfs-server');
let index = 0;
class IpfsStore {
    web3DB: any; // layer on top of orbitdb
    ipfs: any;
    pubsub = new EventEmitter();
    bootingDb: Promise<any> = this.startWeb3DB();
    room: Promise<any> = this.createDb('room');
    roomWatch: Promise<any> = this.createPartialDb('room'); // a database that continuously load items, to be used in subscription
    stuff: Promise<any> = this.createDb('stuff');
    stuffWatch: Promise<any> = this.createPartialDb('stuff'); // a database that continuously load items, to be used in subscription
    user: Promise<any> = this.createDb('user', 'email');
    userWatch: Promise<any> = this.createPartialDb('user'); // a database that continuously load items, to be used in subscription
    order: Promise<any> = this.createDb('order');
    orderWatch: Promise<any> = this.createPartialDb('order'); // a database that continuously load items, to be used in subscription

    get starting(): Promise<any> {
        return Promise.all([
            this.room,
            this.stuff,
            this.user,
            this.order
        ])
    }

    uploadFile(input, cb?: (err, res: any) => void) {
        const readFileContent = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event['target']['result'])
                reader.readAsArrayBuffer(input);
            })
        }
        readFileContent(input)
            .then(buffer => {
                return this.ipfs.files.add([{
                    path: input.name,
                    content: new this.ipfs.types.Buffer(buffer)
                }])
            })
            .then(files => {
                const hash = files[0].hash;
                cb(null, files[0].hash);
            })
    }

    getFile(hash: string): Promise<any> {
        const createFileBlob = (data, hash) => {
            const file = new Blob(data, { type: 'application/octet-binary' });
            const fileUrl = URL.createObjectURL(file);
            return fileUrl;
        }
        return new Promise((resolve, reject) => {
            this.ipfs.files.get(hash, (err, filesStream) => {
                if (err) console.log(err);
                filesStream.on('data', file => {
                    if (file.content) {
                        const buf = [];
                        // buffer up all the data in the file
                        file.content.on('data', (data) => {
                            buf.push(data)
                        })
                        file.content.once('end', () => {
                            console.log('data file', index++ );
                            const listItem = createFileBlob(buf, hash)
                            resolve(listItem);
                        })
                        file.content.resume()
                    }
                })
                filesStream.resume()
                // filesStream.on('end', () => console.log('Every file was fetched for ', hash));
            })
        });
    }

    createPartialDb(dbName: string, indexBy?: string) {
        return new Promise((resolve, reject) => {
            this.bootingDb.then(_ => {
                window[dbName].events.on('ready', message => { //ready is triggered asa 1st db block is loaded
                    resolve(window[dbName]);
                })
            })
        })
    }

    createDb(dbName: string, indexBy?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.bootingDb.then(_ => {
                const db = this.web3DB.docstore(dbName, { indexBy: indexBy || '_id' });
                // db.load(150); // to fetch current ipfs repo
                window[dbName] = db;

                db.events.on('loaded', message => {
                    // we should resolve with a partial database and a fully-loaded database
                    resolve(db);
                })
            })
        });
    }

    startWeb3DB(): Promise<any> {
        this.ipfs = new Ipfs({
            EXPERIMENTAL: { pubsub: true },
            config: {
                Addresses: {
                    Swarm: [
                        '/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss'
                    ]
                }
            }
        });
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
