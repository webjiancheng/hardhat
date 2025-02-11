// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract CYToken is ERC20 {
  string public constant NAME = "cityBull";
  string public constant SYMBOL = "CY";
  uint256 public constant INITIAL_SUPPLY = 1000000;
  
  constructor() payable ERC20(NAME, SYMBOL) {
    _mint(msg.sender, INITIAL_SUPPLY * (10 ** decimals()));
  }
}