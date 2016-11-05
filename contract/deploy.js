#!/usr/bin/env node
const Web3 = require('web3');
const path = require('path');
const solc = require('solc');
const fs = require('fs');

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));


async function compileAndDeploy() {
    let ambrosiaContract;
    try {
        let contract = fs.readFileSync( path.join(__dirname, './Ambrosia.sol') );
        let Ambrosia = contract.toString();
        let input = {};
        input[ path.join(__dirname, './Ambrosia.sol')] = Ambrosia;

        console.log('> Compiling Storage');
        let output = solc.compile({sources: input}, 1);

        console.log(output.contracts, output.formal);
        ambrosiaContract = output.contracts['Ambrosia'];
    }
    catch (e) {
        console.log(e);
    }
    console.log('deploying...')
    let ambrosiaInstance = await deployStorage(ambrosiaContract)
    console.log('...deployed at ' + ambrosiaInstance.address)
}

compileAndDeploy();

function deployStorage(ambrosiaContract) {
    var options = {
        from: web3.eth.accounts[0],
        data: ambrosiaContract.byteCode,
        gas: 2000000
    };
    return new Promise((resolve, reject) => {
        web3.eth.contract(JSON.parse(ambrosiaContract.interface)).new(options, (err, contract) => {
            console.log(err);
            reject(err);
            if(typeof contract.address !== 'undefined') {
                return resolve(contract);
            }
        });
    });
}



