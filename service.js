
const config = require('./config.json');
const Web3 = require('web3');
//const web3 = new Web3('http://127.0.0.1:8545');
var provider = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const web3 = provider;
// Init with private key (server side)
const privateKey = '0x7fd0583acffe10c073f6fbc4bdf9405d821ba25085928aa6409fe43b76913971';
web3.eth.accounts.wallet.add(privateKey);
//const myWalletAddress = web3.eth.accounts.wallet[0].address;
var AccountList = ['0xa3957d49125150BF1155a57eaF259d1604069EE2', '0xE695c30D25cDcDEc4A8a6340F678296D0F1E3863', '0x0a57189D0114e7Bb93dcA4B1E92ceA9f9148d616', '0x71076954757B1fFec9a8C7545e1006c73d8A94e2', '0x2f9968aB365F8136860eBF6aCFDaD88C09E255D5', '0xc1056eEC65e63Fe951E18184C0baC0E8D272569b', '0xDc8B64E3103cc270fa7Ce7108036e7883f6591D5', '0xB654c438F99BD3075B117e153238e96C0C40b332', '0x012B6F2C38976bEd23FAE5d764214c665Ff9A1fA', '0x160Db28Ffd9D7ccC46907D18b309dB1Ef237db8a'];
var privateKeyList = ['0x7fd0583acffe10c073f6fbc4bdf9405d821ba25085928aa6409fe43b76913971', '0x92bfb3ec4e7b17a7bdc5b0e2b68b1e664bdd2a7c9801e3fb69c59c82cfdaf83a', '0xaf861ebb5caa1375b335d875e976b35a7326287d4f6dce7e5a0c2490d8a536df', '0x0eaab927269f9f04fd5081a5b5191283758de7fce8d8e45b21d8ea3a5818b41a', '0x47e4b9f9e87833082b634094aecb58e09f79edc191f2105e3fae983f5f293ee8', '0x821aa7dd294a0727d50f3e7df3856e2600c9ac579ee507d75a8e3b53a05e69f5', '0xce5b2bda4d719eb9ed98f493af18672541a54cc5acabd45a50998d646041c8d8', '0x15aeb58ac94c1a8824a4d74948fb0d49b59ab9a9af82662ca5779bd61264e96b', '0x2356f51affff76eadbca57b5d9c8cbd696478ce217a44b13b80e42d402f8ca65', '0x68d87d3961740512a33da225ec8b9781baef19a5e15339dcd7477bc6c487e70f'];
//var ethers = require('ethers');
//const { ethers } = require("ethers")
//const Ganache = require("ganache-core")
const ganache = require("ganache-core");
//const provider = new ethers.providers.Web3Provider(ganache.provider());
const ethDecimals = 18
// Mainnet Contract for cETH (the collateral-supply process is different for cERC20 tokens)

const cEthAddress = config.cEthAddress;
const cEthAbi = config.cEthAbi;
const cDAIAddress = config.cDAIAddress;
const DAIAddress = config.DAIAddress;
const DAIAbi = config.DAIAbi;
const cDAIAbi = config.cDAIAbi;
const cDAIContract = new web3.eth.Contract(cDAIAbi, cDAIAddress);
const DAIContract = new web3.eth.Contract(DAIAbi, DAIAddress);
//const USDCAddress = config.USDCAddress;
//const USDCAbi = config.USDCAbi;
//const USDC = new web3.eth.Contract(cEtUSDCAbihAbi, USDCAddress);
//const cEthAddress = '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5';
const cEth = new web3.eth.Contract(cEthAbi, cEthAddress);

// Mainnet Contract for the Compound Protocol's Comptroller
const comptrollerAddress = config.comptrollerAddress;
const comptrollerAbi = config.comptrollerAbi;
const priceFeedAddress = config.priceFeedAddress;
const priceFeedAbi = config.priceFeedAbi;
const comptroller = new web3.eth.Contract(comptrollerAbi, comptrollerAddress);
const priceFeed = new web3.eth.Contract(priceFeedAbi, priceFeedAddress);
// Mainnet Contract for the Open Price Feed
// WHY IS PriceFeedAbi not working 
//const priceFeed = new web3.eth.Contract(priceFeedAbi, priceFeedAddress);

// Mainnet address of underlying token (like DAI or USDC)
const underlyingAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // Dai
const erc20Abi = config.erc20Abi;
const underlying = new web3.eth.Contract(erc20Abi, underlyingAddress);

// Mainnet address for a cToken (like cDai, https://compound.finance/docs#networks)
const cTokenAddress = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'; // cDai
const cErcAbi = config.cErcAbi;
const cToken = new web3.eth.Contract(cErcAbi, cTokenAddress);
const assetNameDAI = 'DAI'; // for the log output lines
const assetNameETH = 'ETH';
const underlyingDecimals = 18; // Number of decimals defined in this ERC20 token's contract

// Web3 transaction information, we'll use this for every transaction we'll send
/*
const fromMyWallet = {
  //from: myWalletAddress
  from: AccountList[user],
  gasLimit: web3.utils.toHex(6721975),
  gasPrice: web3.utils.toHex(300000000) // use ethgasstation.info (mainnet only)
};
*/
//const privateKeyBuffer = Buffer.from(PRIV_KEY, 'hex')


exports.initAllfunctions = async function (req, res) {


  var i = 0
  amount = 1
  amountToString = amount.toString();

  const decimals = web3.utils.toBN(18);
  const tokenAmount = web3.utils.toBN(amount * Math.pow(10, 5));
  const tokenAmountHex = '0x' + tokenAmount.mul(web3.utils.toBN(10).pow(decimals)).toString('hex');

  for (i = 0; i < 10; i++) {
    let markets = [cEthAddress];
    await cEth.methods.mint().send({
      from: AccountList[i],
      gasLimit: web3.utils.toHex(6721975),
      gasPrice: web3.utils.toHex(0), // use ethgasstation.info (mainnet only)
      value: web3.utils.toHex(web3.utils.toWei(amountToString, 'kether'))
    }).then((result) => {
      console.log('done')
    }).catch((error) => {
      console.error('[supply] error:', error);
    });

    // This is the cToken contract(s) for your collateral
    await comptroller.methods.enterMarkets(markets).send({
      from: AccountList[i],
      gasLimit: web3.utils.toHex(6721975),
      gasPrice: web3.utils.toHex(0)
    }).then((result) => {
      console.log('done')
    }).catch((error) => {
      console.error('[entering market] error:', error);
    });


    await cToken.methods.borrow(tokenAmountHex).send({
      from: AccountList[i],
      gasLimit: web3.utils.toHex(6721975),
      //mantissa: false,
      gasPrice: web3.utils.toHex(0)
      //gasPrice: web3.utils.toHex(300)
    }).then((result) => {
      console.log('done')
    }).catch((error) => {
      console.error('[borrow] error:', error);
    });



    let markets2 = [cTokenAddress]; // This is the cToken contract(s) for your collateral
    await comptroller.methods.enterMarkets(markets2).send({
      from: AccountList[i],
      gasLimit: web3.utils.toHex(6721975),
      gasPrice: web3.utils.toHex(300000000)
    }).then((result) => {
      console.log('done')
    }).catch((error) => {
      console.error('[entering market] error:', error);
    });
  
    await underlying.methods.approve(cTokenAddress, tokenAmountHex).send({
      from: AccountList[i],
      gasLimit: web3.utils.toHex(6721975),
      //mantissa: false,
      gasPrice: web3.utils.toHex(300)
      //gasPrice: web3.utils.toHex(300)
    }).then((result) => {
      console.log('done')
    }).catch((error) => {
      console.error('[approve] error:', error);
    });
  
    await cToken.methods.mint(tokenAmountHex).send({
      from: AccountList[i],
      gasLimit: web3.utils.toHex(6721975),
      //mantissa: false,
      gasPrice: web3.utils.toHex(300)
      //gasPrice: web3.utils.toHex(300)
    }).then((result) => {
      console.log('done')
    }).catch((error) => {
      console.error('[supply] error:', error);
    });

    console.log(`\nNow attempting to borrow ${amount} ETH...`);
    await cEth.methods.borrow(web3.utils.toWei(amount.toString(), 'ether')).send({
      from: AccountList[i],
      gasLimit: web3.utils.toHex(6721975),
      //mantissa: false,
      gasPrice: web3.utils.toHex(300000000)
      //gasPrice: web3.utils.toHex(300)
    }).then((result) => {
      console.log('done')
    }).catch((error) => {
      console.error('[borrow] error:', error);
    });


  }

  var response = {
    "text": " SupplyETH, SupplyDAI, enter markets and borrow DAI and ETH initialized "
  };

  res = JSON.stringify(response);
  console.log(res)
  return res;

};


exports.startGanache = async function (req, res) {


  var exec = require('child_process').exec, child;
  /*
  child1 = exec('chmod +x ./run_ganache2.sh ',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);

    if (error !== null) {
      console.log('exec error: ' + error);
      err = error.toString();
    }
    console.log('chmod done');
    var response = {
      "text": "chmod really done"
    };
    console.log(response)
  });
  */
  child = exec('sh ./run_ganache2.sh',
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
        err = error.toString();
        res = err
        return res
      }
      console.log('Ganache started');
      var response = {
        "text": "Ganache really started "
      };
      console.log(response)
      res = response
      return res
    });

};


exports.supplyDAI = async function (amountAndUser, user, res) {
  amount = amountAndUser[0];
  user = amountAndUser[1];
  console.log('Supplying ' + amount + ' units of DAI to the Compound Protocol...', '\n');
  underlyingAsCollateral = amount

  const decimals = web3.utils.toBN(18);
  const tokenAmount = web3.utils.toBN(amount);
  const tokenAmountHex = '0x' + tokenAmount.mul(web3.utils.toBN(10).pow(decimals)).toString('hex');

  await underlying.methods.approve(cTokenAddress, tokenAmountHex).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    //mantissa: false,
    gasPrice: web3.utils.toHex(300)
    //gasPrice: web3.utils.toHex(300)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[approve] error:', error);
  });

  await cToken.methods.mint(tokenAmountHex).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    //mantissa: false,
    gasPrice: web3.utils.toHex(300)
    //gasPrice: web3.utils.toHex(300)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[supply] error:', error);
  });
  var response = {
    "text": " Borrow balance of DAI borrowed "
  };

  res = JSON.stringify(response);
  console.log(res)
  return res;
};

exports.SupplyETH = async function (amountAndUser, user, res) {
  amount = amountAndUser[0];
  user = amountAndUser[1];
  console.log('Supplying ' + amount + ' units of ETH to the Compound Protocol...', '\n');
  const ethDecimals = 18; // Ethereum has 18 decimal places
  amountToString = amount.toString();

  await cEth.methods.mint().send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(300000000), // use ethgasstation.info (mainnet only)
    value: web3.utils.toHex(web3.utils.toWei(amountToString, 'ether'))
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[supply] error:', error);
  });
  let cTokenBalance = await cEth.methods.balanceOf(AccountList[user]).call() / 1e8;
  let exchangeRateCurrent = await cEth.methods.exchangeRateCurrent().call();
  exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);
  var error = {
    "text": " balance in cETH " + cTokenBalance + "; balance that was exchange at the rate (from cETH to ETH) of: " + exchangeRateCurrent
  };
  res = JSON.stringify(error);
  console.log(res)
  return res;
};


exports.redeemETH = async function (amountAndUser, user, res) {
  amount = amountAndUser[0];
  user = amountAndUser[1];
  console.log('Redeeming ' + amount + ' units of cETH to the Compound Protocol...', '\n');
  //const ethDecimals = 18; // Ethereum has 18 decimal places
  //amountToString = amount.toString();

  const decimals = web3.utils.toBN(8);
  const tokenAmount = web3.utils.toBN(amount);
  const tokenAmountHex = '0x' + tokenAmount.mul(web3.utils.toBN(10).pow(decimals)).toString('hex');

  await cEth.methods.redeem(tokenAmountHex).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(300000), // use ethgasstation.info (mainnet only)
    //value: web3.utils.toHex(web3.utils.toWei(amountToString, 'ether'))
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[redeem] error:', error);
  });
  let cTokenBalance = await cEth.methods.balanceOf(AccountList[user]).call() / 1e8;
  let exchangeRateCurrent = await cEth.methods.exchangeRateCurrent().call();
  exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);
  var response = {
    "text": " new balance of: " + cTokenBalance + "; balance that was exchange at the rate (from ETH to cETH) of: " + exchangeRateCurrent
  };
  res = 'good'
  console.log(res)
  console.log(response)
  return res;
};


exports.redeemDAI = async function (amountAndUser, user, res) {
  amount = amountAndUser[0];
  user = amountAndUser[1];
  console.log('Redeeming ' + amount + ' units of cETH to the Compound Protocol...', '\n');
  //const ethDecimals = 18; // Ethereum has 18 decimal places
  //amountToString = amount.toString();

  const decimals = web3.utils.toBN(8);
  const tokenAmount = web3.utils.toBN(amount);
  const tokenAmountHex = '0x' + tokenAmount.mul(web3.utils.toBN(10).pow(decimals)).toString('hex');
  
  await underlying.methods.approve(
    cTokenAddress, tokenAmountHex
  ).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(300000), // use ethgasstation.info (mainnet only)
    //value: web3.utils.toHex(web3.utils.toWei(amountToString, 'ether'))
  }).then((result) => {
    console.log('approved')
  }).catch((error) => {
    console.error('[approving redeem] error:', error);
  });

  await cToken.methods.redeem(tokenAmountHex).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(300000), // use ethgasstation.info (mainnet only)
    //value: web3.utils.toHex(web3.utils.toWei(amountToString, 'ether'))
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[redeem] error:', error);
  });
  let cTokenBalance = await cToken.methods.balanceOf(AccountList[user]).call()  / 1e8;
  let exchangeRateCurrent = await cToken.methods.exchangeRateCurrent().call();
  exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + underlyingDecimals - 8);
  var response = {
    "text": " new balance of: " + cTokenBalance + " of cDAIs; balance that was exchange at the rate (from DAI to cDAI) of: " + exchangeRateCurrent
  };
  res = 'good'
  console.log(res)
  console.log(response)
  return res;
};

exports.repayborrowETH = async function (amountAndUser, user, res) {
  amount = amountAndUser[0];
  user = amountAndUser[1];

  console.log('\nEntering market (via Comptroller contract) for ETH (as collateral)...');
  let markets = [cTokenAddress]; // This is the cToken contract(s) for your collateral
  await comptroller.methods.enterMarkets(markets).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(300000000)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[entering market] error:', error);
  });

  console.log(`\nNow attempting to repay ${amount} ETH...`);
  await cEth.methods.repayBorrow().send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    //mantissa: false,
    gasPrice: web3.utils.toHex(300000000),
    value: (web3.utils.toWei(amount.toString(), 'ether'))
    //gasPrice: web3.utils.toHex(300)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[repay borrow] error:', error);
  });
  var response = {
    "text": " repay Borrowing of ETH done "
  };

  res = JSON.stringify(response);
  console.log(res)
  return res;
};


exports.repayborrowDAI = async function (amountAndUser, user, res) {
  amount = amountAndUser[0];
  user = amountAndUser[1];


  const decimals = web3.utils.toBN(18);
  const tokenAmount = web3.utils.toBN(amount);
  const tokenAmountHex = '0x' + tokenAmount.mul(web3.utils.toBN(10).pow(decimals)).toString('hex');

  console.log('\nEntering market (via Comptroller contract) for ETH (as collateral)...');
  let markets = [cEthAddress]; // This is the cToken contract(s) for your collateral
  await comptroller.methods.enterMarkets(markets).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(300000000)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[entering market] error:', error);
  });


  console.log(`Approving ${assetNameDAI} to be transferred from your wallet to the c${assetNameDAI} contract...`);
  await underlying.methods.approve(cTokenAddress, tokenAmountHex).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    //mantissa: false,
    gasPrice: web3.utils.toHex(300000000),
   //value: (web3.utils.toWei(amount.toString(), 'ether'))
    //gasPrice: web3.utils.toHex(300)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[approve repay borrow] error:', error);
  });

  console.log(`\nNow attempting to repay ${amount} DAI...`);
  await cToken.methods.repayBorrow(tokenAmountHex).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    //mantissa: false,
    gasPrice: web3.utils.toHex(300000000),
    //value: (web3.utils.toWei(amount.toString(), 'ether'))
    //gasPrice: web3.utils.toHex(300)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[repay borrow] error:', error);
  });
  var response = {
    "text": " repay Borrowing of DAI done "
  };

  res = JSON.stringify(response);
  console.log(res)
  return res;
};

exports.borrowETH = async function (amountAndUser, user, res) {
  amount = amountAndUser[0];
  user = amountAndUser[1];

  console.log('\nEntering market (via Comptroller contract) for ETH (as collateral)...');
  let markets = [cTokenAddress]; // This is the cToken contract(s) for your collateral
  await comptroller.methods.enterMarkets(markets).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(300000000)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[entering market] error:', error);
  });

  console.log('Calculating your liquid assets in the protocol...');
  let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(AccountList[user]).call();
  liquidity = liquidity / 1e18;

  console.log(`Fetching ${assetNameETH} price from the price feed...`);
  let underlyingPriceInUsd = await priceFeed.methods.price(assetNameETH).call();
  underlyingPriceInUsd = underlyingPriceInUsd / 1e6; // Price feed provides price in USD with 6 decimal places

  console.log(`Fetching borrow rate per block for ${assetNameETH} borrowing...`);
  let borrowRate = await cEth.methods.borrowRatePerBlock().call();
  console.log('done borrow rate')
  borrowRate = borrowRate / Math.pow(10, underlyingDecimals);

  console.log(`\nYou have ${liquidity} of LIQUID assets (worth of USD) pooled in the protocol.`);
  console.log(`1 ${assetNameETH} == ${underlyingPriceInUsd.toFixed(6)} USD`);
  console.log(`You can borrow up to ${liquidity / underlyingPriceInUsd} ${assetNameDAI} from the protocol.`);
  console.log(`NEVER borrow near the maximum amount because your account will be instantly liquidated.`);
  console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetNameDAI} per block.\nThis is based on the current borrow rate.\n`);

  console.log(`\nNow attempting to borrow ${amount} ETH...`);
  await cEth.methods.borrow(web3.utils.toWei(amount.toString(), 'ether')).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    //mantissa: false,
    gasPrice: web3.utils.toHex(300000000)
    //gasPrice: web3.utils.toHex(300)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[borrow] error:', error);
  });
  var response = {
    "text": " Borrow of ETH done "
  };


  console.log('\nFetching your ETH borrow balance from cETH contract...');
  let balance = await cEth.methods.borrowBalanceCurrent(AccountList[user]).call();
  balance = balance / 1e18; // because DAI is a 1e18 scaled token.
  console.log(`Borrow balance is ${balance} ETH`);

  res = JSON.stringify(response);
  console.log(res)
  return res;
};

exports.borrowDAI = async function (amountAndUser, user, res) {
  amount = amountAndUser[0];
  user = amountAndUser[1];

  console.log('\nEntering market (via Comptroller contract) for ETH (as collateral)...');
  let markets = [cEthAddress]; // This is the cToken contract(s) for your collateral
  await comptroller.methods.enterMarkets(markets).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    gasPrice: web3.utils.toHex(300000000)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[entering market] error:', error);
  });

  console.log('Calculating your liquid assets in the protocol...');
  let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(AccountList[user]).call();
  liquidity = liquidity / 1e18;

  console.log(`Fetching ${assetNameDAI} price from the price feed...`);
  let underlyingPriceInUsd = await priceFeed.methods.price(assetNameDAI).call();
  underlyingPriceInUsd = underlyingPriceInUsd / 1e6; // Price feed provides price in USD with 6 decimal places

  console.log(`Fetching borrow rate per block for ${assetNameDAI} borrowing...`);
  let borrowRate = await cToken.methods.borrowRatePerBlock().call();
  borrowRate = borrowRate / Math.pow(10, underlyingDecimals);

  console.log(`\nYou have ${liquidity} of LIQUID assets (worth of USD) pooled in the protocol.`);
  console.log(`1 ${assetNameDAI} == ${underlyingPriceInUsd.toFixed(6)} USD`);
  console.log(`You can borrow up to ${liquidity / underlyingPriceInUsd} ${assetNameDAI} from the protocol.`);
  console.log(`NEVER borrow near the maximum amount because your account will be instantly liquidated.`);
  console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetNameDAI} per block.\nThis is based on the current borrow rate.\n`);



  const decimals = web3.utils.toBN(18);
  const tokenAmount = web3.utils.toBN(amount);
  const tokenAmountHex = '0x' + tokenAmount.mul(web3.utils.toBN(10).pow(decimals)).toString('hex');

  await cToken.methods.borrow(tokenAmountHex).send({
    from: AccountList[user],
    gasLimit: web3.utils.toHex(6721975),
    //mantissa: false,
    gasPrice: web3.utils.toHex(300000000)
    //gasPrice: web3.utils.toHex(300)
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[borrow] error:', error);
  });
  var response = {
    "text": " Borrow balance of DAI borrowed "
  };

  res = JSON.stringify(response);
  console.log(res)
  return res;
};




exports.checkcDAIBalance = async function (user, res) {


  let cTokenBalance = await cToken.methods.balanceOf(AccountList[user]).call() / 1e8;

  //const ethBalanceWei = await wallet.getBalance()
  //const ethBalance = ethers.utils.formatEther(ethBalanceWei)

  var response = {
    "text": " balance in cDAI " + cTokenBalance
  };
  res = cTokenBalance
  return res
};

exports.checkCTokenBalance = async function (user, res) {


  let cTokenBalance = await cEth.methods.balanceOf(AccountList[user]).call() / 1e8;

  //const ethBalanceWei = await wallet.getBalance()
  //const ethBalance = ethers.utils.formatEther(ethBalanceWei)

  var response = {
    "text": " balance in cETH " + cTokenBalance
  };
  res = cTokenBalance
  return res
};


exports.invalidRequest = function (req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Invalid Request');
};



exports.checkSUMAccountsETH = async function (user, res) {
  //const provider = new ethers.providers.Web3Provider(ganache.provider())
  //web3.eth.getBalance("0xa3957d49125150BF1155a57eaF259d1604069EE2", function (err, result) {

  var i;
  var sumBalance = web3.utils.toBN(0)
  for (i = 0; i < 10; i++) {
    sumBalance = sumBalance.add(web3.utils.toBN((await web3.eth.getBalance(AccountList[i]))))
  }
  // sumBalance = web3.utils.toBN(sumBalance)
  var response = {
    "text": "total balance in Ether in all wallets: " + web3.utils.fromWei(sumBalance, "kether")
  };
  res = web3.utils.fromWei(sumBalance, "kether");
  console.log(JSON.stringify(response))
  return res;
};


exports.startAndCheckEther = async function (user, res) {
  //const provider = new ethers.providers.Web3Provider(ganache.provider())
  //web3.eth.getBalance("0xa3957d49125150BF1155a57eaF259d1604069EE2", function (err, result) {
  let ETHBalance = await web3.eth.getBalance(AccountList[user]);
  var response = {
    "text": "balance in Ether in our wallet: " + web3.utils.fromWei(ETHBalance, "kether")
  };
  res = web3.utils.fromWei(ETHBalance, "kether");
  console.log(JSON.stringify(response))
  return res;
};



exports.checkSUMDAIBalance = async function (user, res) {

  var i;
  var sumBalance = 0
  for (i = 0; i < 10; i++) {
    sumBalance = sumBalance + Number(await cToken.methods.borrowBalanceCurrent(AccountList[i]).call());
  }
  sumBalance = sumBalance / Math.pow(10, underlyingDecimals);
  console.log(`Total (borrowed) balance is ${sumBalance} ${assetNameDAI}`);

  var response = {
    "text": " Total balance of DAI " + sumBalance
  };

  res = sumBalance
  console.log(JSON.stringify(response))
  return res;
};



exports.checknonborrowedDAIBalance = async function (user, res) {

  let balance = await underlying.methods.balanceOf(AccountList[user]).call();
  balance = balance / Math.pow(10, underlyingDecimals);
  console.log(`Borrow balance is ${balance} ${assetNameDAI}`);

  var response = {
    "text": " Borrow balance of DAI " + balance
  };

  res = balance
  console.log(JSON.stringify(response))
  return res;
};

exports.checkDAIBalance = async function (user, res) {

  let balance = await cToken.methods.borrowBalanceCurrent(AccountList[user]).call();
  balance = balance / Math.pow(10, underlyingDecimals);
  console.log(`Borrow balance is ${balance} ${assetNameDAI}`);

  var response = {
    "text": " Borrow balance of DAI " + balance
  };

  res = balance
  console.log(JSON.stringify(response))
  return res;
};


exports.checkSUMAccountsTotalLiquidity = async function (user, res) {

  var i = 0
  //var liquidity = web3.utils.toBN(0)
  var liquidity = 0

  for (i = 0; i < 10; i++) {
    let { 1: liquiditytemp } = await comptroller.methods.getAccountLiquidity(AccountList[i]).call()
    liquiditytemp = liquiditytemp / 1e18
    liquidity = liquidity + liquiditytemp
  }
  // liquidity = liquidity.div(1e18)
  // liquidity = liquidity.toNumber()
  var response = {
    "text": ' Total Liquidity :' + liquidity
  };
  console.log(response)
  res = liquidity;

  return res;
};

exports.calculateLiquidity = async function (user, res) {


  console.log('Calculating your liquid assets in the protocol...');
  let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(AccountList[user]).call();
  liquidity = liquidity / 1e18;

  console.log('Fetching cETH collateral factor...');
  let { 1: collateralFactor } = await comptroller.methods.markets(cEthAddress).call();
  collateralFactor = (collateralFactor / 1e18) * 100; // Convert to percent

  console.log(`Fetching ${assetNameDAI} price from the price feed...`);
  let underlyingPriceInUsd = await priceFeed.methods.price(assetNameDAI).call();
  underlyingPriceInUsd = underlyingPriceInUsd / 1e6; // Price feed provides price in USD with 6 decimal places

  console.log(`Fetching borrow rate per block for ${assetNameDAI} borrowing...`);
  let borrowRate = await cToken.methods.borrowRatePerBlock().call();
  borrowRate = borrowRate / Math.pow(10, underlyingDecimals);

  console.log(`\nYou have ${liquidity} of LIQUID assets (worth of USD) pooled in the protocol.`);
  console.log(`You can borrow up to ${collateralFactor}% of your TOTAL collateral supplied to the protocol as ${assetNameDAI}.`);
  console.log(`1 ${assetNameDAI} == ${underlyingPriceInUsd.toFixed(6)} USD`);
  console.log(`You can borrow up to ${liquidity / underlyingPriceInUsd} ${assetNameDAI} from the protocol.`);
  console.log(`NEVER borrow near the maximum amount because your account will be instantly liquidated.`);
  console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetNameDAI} per block.\nThis is based on the current borrow rate.\n`);

  var response = {
    "text": ' You can borrow up to :' + liquidity / underlyingPriceInUsd + ' units of ' + assetNameDAI + ' from the protocol '
  };
  console.log(response)
  res = liquidity;

  return res;
};


exports.checkSUMAccountscDAI = async function (user, res) {
  //const provider = new ethers.providers.Web3Provider(ganache.provider())
  //web3.eth.getBalance("0xa3957d49125150BF1155a57eaF259d1604069EE2", function (err, result) {

  var i;
  var sumBalance = 0
  for (i = 0; i < 10; i++) {

    let cTokenBalance = await cToken.methods.balanceOf(AccountList[i]).call() / 1e8;
    sumBalance = sumBalance + cTokenBalance
  }
  // sumBalance = web3.utils.toBN(sumBalance)
  var response = {
    "text": "total balance in cDAI in all wallets: " + sumBalance
  };
  res = sumBalance;
  console.log(JSON.stringify(response))
  return res;
};

exports.checkAccountcETHBalance = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  console.log('Calculating your liquid assets in the protocol...');
  let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(AccountList[user]).call();
  liquidity = liquidity / 1e18;


  var response = {
    "text": " total balance of cTokens not engaged in borrowing/lending: " + liquidity + " (worth in USD at the current exchange rates)"
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};

exports.checkSUMAccountscETH = async function (user, res) {
  //const provider = new ethers.providers.Web3Provider(ganache.provider())
  //web3.eth.getBalance("0xa3957d49125150BF1155a57eaF259d1604069EE2", function (err, result) {

  var i;
  var sumBalance = 0
  for (i = 0; i < 10; i++) {

    let cTokenBalance = await cEth.methods.balanceOf(AccountList[i]).call() / 1e8;
    sumBalance = sumBalance + cTokenBalance
  }
  // sumBalance = web3.utils.toBN(sumBalance)
  var response = {
    "text": "total balance in cEther in all wallets: " + sumBalance
  };
  res = sumBalance;
  console.log(JSON.stringify(response))
  return res;
};

exports.checkAccountcETHBalance = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  console.log('Calculating your liquid assets in the protocol...');
  let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(AccountList[user]).call();
  liquidity = liquidity / 1e18;


  var response = {
    "text": " total balance of cTokens not engaged in borrowing/lending: " + liquidity + " (worth in USD at the current exchange rates)"
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};



exports.getCollateralFactor = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  //const ethBalanceWei = await wallet.getBalance()
  //const ethBalance = ethers.utils.formatEther(ethBalanceWei)



  console.log('Fetching cETH collateral factor...');
  let { 1: collateralFactor } = await comptroller.methods.markets(cEthAddress).call();
  collateralFactor = (collateralFactor / 1e18) * 100; // Convert to percent

  var response = {
    "text": "collateral factor for cETH is : " + collateralFactor + " percent"

  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};

/*
exports.exchangeRatecETHDAI = async function (user, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  let underlyingPriceInUsd = await priceFeed.methods.price(assetNameDAI).call();
  underlyingPriceInUsd = underlyingPriceInUsd / 1e6; // Price feed provides price in USD with 6 decimal places


  let exchangeRateCurrent = await cEth.methods.exchangeRateCurrent().call();
  exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);

  //ratecETHDAI =  (  ETHUSD= 2554.23 / DAIUSD = underlyingPriceInUsd) / ETHcETH

  ratecETHDAI =  2554.23 / ( underlyingPriceInUsd * exchangeRateCurrent)

  var response = {
    "text": " exchange rate (from cETH to DAI) of: " + exchangeRateCurrent

  };

  res = exchangeRateCurrent
  console.log(response)
  return res;
};
*/



exports.exchangeRatecDAIDAI = async function (user, res) {

  const underlyingDecimals = 18; // Ethereum has 18 decimal places

  let erCurrent = await cToken.methods.exchangeRateCurrent().call();
  let exchangeRate = erCurrent / Math.pow(10, 18 + underlyingDecimals - 8);
  console.log(`Current exchange rate from c${assetNameDAI} to ${assetName}:`, exchangeRate, '\n');

  var response = {
    "text": " exchange rate (from cDAI to DAI) of: " + exchangeRateCurrent

  };

  res = exchangeRate
  console.log(response)
  return res;
};

exports.exchangeRatecETHETH = async function (user, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  let exchangeRateCurrent = await cEth.methods.exchangeRateCurrent().call();
  exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);

  var response = {
    "text": " exchange rate (from cETH to ETH) of: " + exchangeRateCurrent

  };

  res = exchangeRateCurrent
  console.log(response)
  return res;
};


exports.borrowRateDAI = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  console.log(`Fetching borrow rate per block for ${assetNameDAI} borrowing...`);
  let borrowRate = await cToken.methods.borrowRatePerBlock().call();
  //borrowRate = borrowRate / Math.pow(10, underlyingDecimals);
  borrowRate = (borrowRate / Math.pow(10, underlyingDecimals)) * Math.pow(10, 9);

  console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetNameDAI} per block.\nThis is based on the current borrow rate.\n`);

  var response = {
    "text": ' borrow rate of ' + assetNameDAI + ' is: ' + borrowRate
  };

  res = borrowRate
  console.log(response)
  return res;
};



exports.borrowRateETH = async function (req, res) {

  console.log(`Fetching borrow rate per block for ${assetNameETH} borrowing...`);
  let borrowRate = await cEth.methods.borrowRatePerBlock().call();
  borrowRate = (borrowRate / Math.pow(10, underlyingDecimals)) * Math.pow(10, 9);

  console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetNameETH} per block.\nThis is based on the current borrow rate.\n`);

  var response = {
    "text": ' borrow rate of ' + assetNameETH + ' is: ' + borrowRate
  };

  res = borrowRate
  console.log(response)
  return res;
};

exports.exchangeRateETHUSD = async function (req, res) {

  /*
  const ethDecimals = 18; // Ethereum has 18 decimal places

  let exchangeRateCurrent = await cEth.methods.exchangeRateCurrent().call();
  exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);

  //const ethBalanceWei = await wallet.getBalance()
  //const ethBalance = ethers.utils.formatEther(ethBalanceWei)
  let underlyingPriceInUsd = await priceFeed.methods.getUnderlyingPrice(cEthAddress).call();
  underlyingPriceInUsd = underlyingPriceInUsd / 1e18; // Price feed provides price in USD with 6 decimal places
  underlyingPriceInUsdETH = underlyingPriceInUsd // exchangeRateCurrent ;

  var response = {
    "text": " exchange rate (from ETH to USD) of: " + underlyingPriceInUsdETH
  };

  res = underlyingPriceInUsdETH
  console.log(response)
  return res;
  */

  res = 2554.23
  var response = {
    "text": " exchange rate (from ETH to USD) of: " + res
  };
  console.log(response)
  return res
};

