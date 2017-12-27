import uPort from './Uport';

const Web3 = require('web3');
const contract = require('truffle-contract');

const database_artifact = require('/Users/tduchene/Code/truffle/build/contracts/DataBase.json');



const DataBase = (): Promise<{ instance: any, credentials: any }> => new Promise((resolve, reject) => {

    const db = contract(database_artifact);

    const logWithMetamask = () => {
        web3 = new Web3(web3.currentProvider);
        db.setProvider(web3.currentProvider);
        web3.eth.getAccounts((err, accs) => {
            db.deployed().then(instance => {
                if( !accs.length ) return logWithUport();
                const credentials = { address: accs[0] };
                resolve({ instance, credentials });
            })
        })
    }

    const logWithUport = () => {
        window["web3"] = uPort.getWeb3();
        db.setProvider(window["web3"].currentProvider);
        if (!sessionStorage.userId) {
            return uPort.requestCredentials().then(credentials => {
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
    // if we are in mist or metamask the var web3 is already there
    if (typeof web3 !== 'undefined') {
        // logWithMetamask()
        logWithUport();
    } else {
        // set the provider you want from Web3.providers
        logWithUport();
    }
});

export default DataBase;