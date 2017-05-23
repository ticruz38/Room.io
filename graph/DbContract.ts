const Web3 = require('web3');
const contract = require('truffle-contract');
// const database_artifact = require('/Users/tduchene/Code/truffle/build/contracts/DataBase.json');
const database = require('/Users/tduchene/Code/truffle/bin/contracts/DataBase.json');

const DataBase: Promise<{instance: any, account: string}> = new Promise((resolve, reject) => {
    // if we are in mist or metamask the var web3 is already there
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        window["web3"] = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }
    const db = window['web3'].eth.contract(JSON.parse(database.abi));
    const dbInstance = db.at(['0x330cd6C307E8B0aaCbbe3183C5273ef948D6005A']);
    resolve(dbInstance);
});

export default DataBase;