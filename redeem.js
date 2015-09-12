function redeemLock(address, build) {
    web3.personal.unlockAccount(web3.eth.defaultAccount);

    if (!build) {
        console.error("'build' was not set! Cancelling deployment...");
        return;
    }

    var contract = web3.eth.contract(build.contracts.CoinLock.abi).at(address);
    var redemptionTx = contract.redeem({from: web3.eth.defaultAccount, gas: 180000});
    console.log("Redemption tx is " + redemptionTx);
};

if (typeof(address) == "undefined") {
    console.error("You must set the 'address' variable first!");

} else if (typeof(web3.eth.defaultAccount) == "undefined") {
    console.error("You must set 'web3.eth.defaultAddress' first!");
    console.error("Needs to be the same as the address you used to create the lock.");

} else {
    if (typeof(build) == "undefined") {
        var build = {"contracts":{"CoinLock":{"abi":"[{\"constant\":true,\"inputs\":[],\"name\":\"expiration\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"type\":\"function\"},{\"constant\":false,\"inputs\":[],\"name\":\"redeem\",\"outputs\":[],\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"_expiration\",\"type\":\"uint256\"}],\"name\":\"lock\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"type\":\"function\"}]\n","bin":"60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6101e2806100406000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900480634665096d1461004f578063be040fb014610070578063dd4670641461007d5761004d565b005b61005a6004506100a4565b6040518082815260200191505060405180910390f35b61007b600450610140565b005b61008e6004803590602001506100ad565b6040518082815260200191505060405180910390f35b60016000505481565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561013a57428211801561011957506000600160005054145b1561013157816001600050819055506001905061013b565b6000905061013b565b5b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156101df576001600050544211156101de57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b5b56"},"owned":{"abi":"[{\"inputs\":[],\"type\":\"constructor\"}]\n","bin":"60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b600a80603e6000396000f30060606040526008565b00"}}};
        build.contracts.CoinLock.abi = JSON.parse(build.contracts.CoinLock.abi);
    };
    console.log("Everything looks in order.");
    console.log("Retrieving coins at " + address);
    redeemLock(address, build);
}
