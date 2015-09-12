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

    function createLock(expiration) {
        web3.personal.unlockAccount(web3.eth.defaultAccount);

        var contractTx = web3.eth.sendTransaction({from: web3.eth.defaultAccount, data: build.code, gas: 180000})
        console.log("Contract deployment tx: " + contractTx);
        console.log("Waiting 12 blocks to ensure we aren't on a fork.");

        var contract
        var filter = web3.eth.filter('latest');
        filter.watch(function (err, bhash) {
           var txReceipt = web3.eth.getTransactionReceipt(contractTx);
           if (!txReceipt) return;

           console.log(((txReceipt.blockNumber + 12) - web3.eth.blockNumber) + " more blocks...");

           if (txReceipt.contractAddress && (txReceipt.blockNumber + 12) <= web3.eth.blockNumber) {
               console.log("Contract address is " + txReceipt.contractAddress);
               console.log("DO NOT LOSE THIS ADDRESS!");

               var contract = web3.eth.contract(build.info.abiDefinition).at(txReceipt.contractAddress);
               console.log("Setting lock expiration to " + dateString(expiration));
               contract.lock(expiration);
               console.log("Done. Run 'redeem.js' after the expiration to get your ether back."); 
               filter.stopWatching();
           }
        });
    };

    function dateString(secs) {
        return (new Date(secs*1000)).toLocaleString();
    };

    if (typeof(expiration) == "undefined") {
        console.error("You must set the 'expiration' variable first!");
    } else if (typeof(web3.eth.defaultAccount) == "undefined") {
        console.error("You must set 'eth.defaultAccount' first!");
    } else if (expiration < Date.now() / 1000) {
        console.error("Cannot set an expiration date in the past.");
    } else if (eth.accounts.indexOf(web3.eth.defaultAccount) == -1) {
        console.error("'eth.defaultAccount' must be an account you own!");
    } else if (new Date(expiration) == 'Invalid Date') {
        console.error("Invalid timestamp: " + expiration);
    } else {
        console.log("Everything looks in order.");
        console.log("Creating a lock that expires " + dateString(expiration));
        createLock(expiration);
    }
})();
