// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {
    constructor() payable ERC20("ERC20Mock", "ERC20MCK") {
        _mint(msg.sender, 1_000_000 ether);
    }
}
