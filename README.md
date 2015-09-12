# Coin Lock

Smart contract that locks your coins up for a predetermined time period, expressed as the number of seconds since the Unix epoch (which is the same format as block timestamps). This software is published as-is. It's worked in testing, but there are always unforseeable things that can go wrong in practice. By using it, you accept all responsibility for whatever happens to your ether.

## Usage

Launch geth and wait until it's all caught up with the rest of the network. In another window, run `geth attach` and follow the example below.

```
> eth.defaultAccount = eth.accounts[1] // Choose whichever account you want here.
"0x35d68fb24df0e54d44e6cc32f75f1cc891f57811" // It'll echo back the address you chose.
> eth.getBalance(eth.defaultAccount, 'latest')
5.000129328647354980468e+19
> var expiration = eth.getBlock('latest').timestamp + 600; // Expire in 10 minutes.
undefined
> loadScript('coinlock.js')
Everything looks in order.
Creating a lock that expires 2015-09-11 18:29:00
Unlock account 35d68fb24df0e54d44e6cc32f75f1cc891f57811
Passphrase: 
Contract deployment tx: 0x... // Yours won't be truncated.
Waiting 12 blocks to ensure we aren't on a fork.
true
> 12 more blocks...
11 more blocks...
10 more blocks...
9 more blocks...
8 more blocks...
7 more blocks...
6 more blocks...
5 more blocks...
4 more blocks...
3 more blocks...
2 more blocks...
1 more blocks...
0 more blocks...
Contract address is 0xc027...
DO NOT LOSE THIS ADDRESS! // Or you'll lose access to your coins!
Setting lock expiration to 2015-09-11 18:29:00
Done. Run 'redeem.js' after the expiration to get your ether back.
> eth.sendTransaction({from: eth.defaultAccount, to: "0xc027...", value: 1000000000000000000})
"0x..." // Loaded up 1 ether into lock contract.
```

At this point you can try to redeem the lock. It won't send your coins until the latest block timestamp has passed the expiration timestamp you set earlier. When you finally redeem your coins, it should look something like the example below.

```
> eth.defaultAccount = eth.accounts[1] // Has to be the account that created the lock.
"0x35d68fb24df0e54d44e6cc32f75f1cc891f57811"
> var address="0xc027...";
undefined
> loadScript('./redeem.js')
Everything looks in order.
Retrieving coins at 2015-09-11 18:29:00
Unlock account 35d68fb24df0e54d44e6cc32f75f1cc891f57811
Passphrase: 
Redemption tx is 0x...
true
> eth.getBalance(eth.defaultAccount, 'latest')
5.000127707697354980468e+19
```

Feel free to open an issue if you have any questions or concerns.

## Notes

If you don't trust binary blobs in Javascript files with your ether (and you shouldn't!), you can easily substitute your own compiled code by setting the `build` variable before running `coinlock.js` or `redeem.js`. Here is the command you want for solc 1.2:

    solc --combined-json bin,abi coinlock.sol

Copy the string it outputs into your geth console and then parse the ABI into something geth can work with:

    > var build = {"contracts"...
    > build.contracts.CoinLock.abi = JSON.parse(build.contracts.CoinLock.abi)

And then continue on with the examples as written.
