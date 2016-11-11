const solc = require('solc');
const Web3 = require('web3');
const pudding = require('ether-pudding');
const fs = require('fs');
const path = require('path');

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
let input = {};
input[path.join(__dirname, './Ambrosia.sol')] = fs.readFileSync( path.join(__dirname, './Ambrosia.sol') ).toString()
const output = solc.compile({sources: input}, 1);

for (var contractName in output.contracts) {
    // code and ABI that are needed by web3
    console.log(contractName + ': ' + output.contracts[contractName].bytecode);
    console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface)); // or ABI
    deployContract(output.contracts[contractName], contractName);
}

function deployContract(contract, contractName) {
    var MyContract = web3.eth.contract(JSON.parse(contract.interface)); 
    var contractInstance = MyContract.new({
        data: contract.bytecode,
        from: web3.eth.accounts[0],
        gas: 1000000}, function(err, myContract) {
            if(!err) {
                    // e.g. check tx hash on the first call (transaction send)
                if(!myContract.address) {
                    console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract

                // check address on the second call (contract deployed)
                } else {
                    console.log(myContract.address) // the contract address
                    pudding.save({
                        abi: JSON.parse(contract.interface),
                        unlinked_binary: contract.bytecode,
                        address: myContract.address
                    }, './contract/'+ contractName +'.sol.js')
                }
            }
        }
    );
}
