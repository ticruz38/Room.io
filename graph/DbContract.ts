import { Connect } from 'uport-connect';
const uport = new Connect('Roomio');
const Web3 = require('web3');
const contract = require('truffle-contract');

const database_artifact = require('/Users/tduchene/Code/truffle/build/contracts/DataBase.json');



const DataBase = (): Promise<{ instance: any, credentials: any }> => new Promise((resolve, reject) => {
    const db = contract(database_artifact);
    // if we are in mist or metamask the var web3 is already there
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
        db.setProvider(web3.currentProvider);
        web3.eth.getAccounts((err, accs) => {
            db.deployed().then(instance => {
                const credentials = { address: accs[0] };
                resolve({ instance, credentials });
            })
        })
    } else {
        // set the provider you want from Web3.providers
        window["web3"] = uport.getWeb3();
        db.setProvider(web3.currentProvider);
        if (!sessionStorage.userId) {
            return uport.requestCredentials().then(credentials => {
                console.log(credentials);
                db.deployed().then(instance => {
                    resolve({ instance, credentials });
                });
            }).catch(error => reject(error));
        }
        db.deployed().then(instance => {
            const credentials = { address: sessionStorage.userId };
            resolve({ instance, credentials });
        })
    }
});

export default DataBase;