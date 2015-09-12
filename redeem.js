(function () {
    var contractCode = [
        'contract owned {',
        '    function owned() {',
        '        owner = msg.sender;',
        '    }',
        '    modifier onlyowner() { ',
        '        if (msg.sender == owner)',
        '            _',
        '    }',
        '    address owner;',
        '}',
        'contract CoinLock is owned {',
        '    uint public expiration; // Timestamp in # of seconds.',
        '    ',
        '    function lock(uint _expiration) onlyowner returns (bool) {',
        '        if (_expiration > block.timestamp && expiration == 0) {',
        '            expiration = _expiration;',
        '            return true;',
        '        }',
        '        return false;',
        '    }',
        '    function redeem() onlyowner {',
        '        if (block.timestamp > expiration) {',
        '            suicide(owner);',
        '        }',
        '    }',
        '}'
    ].join("\n");
    var build = eth.compile.solidity(contractCode).CoinLock;

    function redeemLock(address) {
        web3.personal.unlockAccount(web3.eth.defaultAccount);

        var contract = web3.eth.contract(build.info.abiDefinition).at(address);
        var redemptionTx = contract.redeem({from: web3.eth.defaultAccount, gas: 180000});
        console.log("Redemption tx is " + redemptionTx);
    };

    if (typeof(address) == "undefined") {
        console.error("You must set the 'address' variable first!");

    } else if (typeof(web3.eth.defaultAccount) == "undefined") {
        console.error("You must set 'web3.eth.defaultAddress' first!");
        console.error("Needs to be the same as the address you used to create the lock.");

    } else {
        console.log("Everything looks in order.");
        console.log("Retrieving coins at " + address);
        redeemLock(address);
    }
})();
