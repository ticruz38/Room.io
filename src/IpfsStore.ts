import { observable } from 'mobx';

declare let node: any;

declare const require: any;

const Orbitdb = require('orbit-db');
const Ipfs = require('ipfs');


class IpfsStore {
    constructor() {
        const that = this;
        const node = new Ipfs();
        const orbitdb = new Orbitdb(node);
        // TODO doesnt work if no repo yet initialized these next lines needs to be wrapped inside async logic
        if(!node._repo) {
            node.init({ emptyRepo: true, bits: 2048 }, (err: Error) => {
            if (err) { throw err }

            })
        }
        node.load((err : Error) => {
            if(err) { throw err }
            console.log('load');
            node.goOnline((err: Error) => {
                if (err) { throw err }
                that.restaurant = orbitdb.docstore('restaurants')
            });
        });
    }
    @observable node: any;
    @observable restaurant: any;
}

export default new IpfsStore();
