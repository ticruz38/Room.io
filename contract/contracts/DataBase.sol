pragma solidity ^0.4.2;

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract DataBase {
    mapping ( string => address ) collections;

    event DbUpdate(address _hash, string _collection);

	function DataBase() public {
        // collections[ "room" ] = "1";
		// balances[tx.origin] = 10000;
	}

    function saveCollection( string dbName, address _hash ) public returns(bool) {
        collections[dbName] = _hash;
        DbUpdate(_hash, dbName);
        return true;
    }

    function getCollection( string db ) public returns(address _hash) {
        return collections[db];
    }
}