pragma solidity ^0.4.4;


contract Utility{
	function convert(uint amount,uint conversionRate) returns (uint convertedAmount)
	{
		return amount * conversionRate;
	}
}