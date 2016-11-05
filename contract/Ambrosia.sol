pragma solidity ^0.4.4;

contract Ambrosia {

    mapping (address => bytes32) restaurants;

    address _owner;

	event Transfer(address indexed _from, address indexed _to, uint256 _value); // listen to that event whenever a transfer has been made..

    event Order(address indexed _from, address indexed _to, uint256 _value); // listen to that event whenever an order is triggered

	function Ambrosia() {
        _owner = msg.sender;
	}
}