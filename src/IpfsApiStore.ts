import { observable } from 'mobx';

declare const require: any;

const Orbitdb = require('orbit-db');
const IpfsApi = require('@haad/ipfs-api');


class IpfsStore {
    nodeID: string;
    node: any;
    restaurant: any;
    chat: any;
    constructor() {
        this.node = new IpfsApi('localhost', '5001', {protocol: 'http'});
        this.nodeID = this.node.id().then((config: any) => this.nodeID = config.id);
        const orbitdb = new Orbitdb(this.node);
        try {
            this.restaurant = orbitdb.docstore('restaurant');
        } catch (e) {
            console.log(e);
        }
    }
}

export default new IpfsStore();
