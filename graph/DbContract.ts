const Web3 = require('web3');
const contract = require('truffle-contract');
const database_artifact = require('/Users/tduchene/Code/truffle/build/contracts/DataBase.json');



const DataBase: Promise<{instance: any, account: string}> = new Promise((resolve, reject) => {
    const db = contract(database_artifact);
    // if we are in mist or metamask the var web3 is already there
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        window["web3"] = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    db.setProvider(web3.currentProvider);
    web3.eth.getAccounts(function (err, accs) {
        if (err != null) {
            reject("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            reject("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }
        const account = accs[0];
        db.deployed().then(instance => {
            resolve({instance, account});
        })
    });
});

export default DataBase;