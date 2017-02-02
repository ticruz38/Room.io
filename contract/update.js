const Ambrosia = require('./Ambrosia.sol.js');
const Web3 = require('web3');

const web3 = new Web3();

Ambrosia.setProvider(new web3.providers.HttpProvider("http://localhost:8545"))

Ambrosia.new().then(function(ambrosia) {

}).catch(function(err) {
    console.log("Error creating contract!");
    console.log(err.stack);
});