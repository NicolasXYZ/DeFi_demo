
const config = require('./config.json');
const Web3 = require('web3');
//const web3 = new Web3('http://127.0.0.1:8545');
var provider = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const web3 = provider;
// Init with private key (server side)
const privateKey = '0x7fd0583acffe10c073f6fbc4bdf9405d821ba25085928aa6409fe43b76913971';
web3.eth.accounts.wallet.add(privateKey);
const myWalletAddress = web3.eth.accounts.wallet[0].address;
//var ethers = require('ethers');
//const { ethers } = require("ethers")
//const Ganache = require("ganache-core")
const ganache = require("ganache-core");
//const provider = new ethers.providers.Web3Provider(ganache.provider());

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
const fromMyWallet = {
  from: myWalletAddress,
  gasLimit: web3.utils.toHex(6721975),
  gasPrice: web3.utils.toHex(300000000) // use ethgasstation.info (mainnet only)
};
//const privateKeyBuffer = Buffer.from(PRIV_KEY, 'hex')




exports.startGanache = async function (req, res) {


  var exec = require('child_process').exec, child;
  child = exec('sh ./run_ganache2.sh',
    function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);


      if (error !== null) {
        console.log('exec error: ' + error);
        err = error.toString();
        res.end(error.toString());
      }
      console.log('Ganache started');
      var response = {
        "text": "Ganache started "
      };
      res.end(JSON.stringify(response))
    });

  return res;
};

exports.startAndCheckEther = async function (req, res) {
  //const provider = new ethers.providers.Web3Provider(ganache.provider())
  web3.eth.getBalance("0xa3957d49125150BF1155a57eaF259d1604069EE2", function (err, result) {
    if (err) {
      console.log(err)
    } else {
      console.log(web3.utils.fromWei(result, "ether") + " ETH")
    }

    var response = {
      "text": "balance in Ether in our wallet: " + web3.utils.fromWei(result, "ether")
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
  })

  return res;
};


exports.SupplyETH = async function (amount, res) {

  console.log('Supplying ' + amount + ' units of ETH to the Compound Protocol...', '\n');
  const ethDecimals = 18; // Ethereum has 18 decimal places
  amountToString = amount.toString();
  await cEth.methods.mint().send({
    from: myWalletAddress,
    gasLimit: web3.utils.toHex(800000),
    gasPrice: web3.utils.toHex(20000000000), // use ethgasstation.info (mainnet only)
    value: web3.utils.toHex(web3.utils.toWei(amountToString, 'ether'))
  }).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[supply] error:', error);
  });
  let cTokenBalance = await cEth.methods.balanceOf(myWalletAddress).call() / 1e8;
  let exchangeRateCurrent = await cEth.methods.exchangeRateCurrent().call();
  exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);
  var error = {
    "text": " balance in cETH " + cTokenBalance + "; balance that was exchange at the rate (from cETH to ETH) of: " + exchangeRateCurrent
  };
  res = JSON.stringify(error);
  console.log(res)
  return res;
};



exports.borrowDAI = async function (amount, res) {

  console.log('\nEntering market (via Comptroller contract) for ETH (as collateral)...');
  let markets = [cEthAddress]; // This is the cToken contract(s) for your collateral
  await comptroller.methods.enterMarkets(markets).send(fromMyWallet).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[entering market] error:', error);
  });

  console.log('Calculating your liquid assets in the protocol...');
  let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(myWalletAddress).call();
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

  const underlyingToBorrow = amount;
  console.log(`Now attempting to borrow ${underlyingToBorrow} ${assetNameDAI}...`);
  const scaledUpBorrowAmount = (underlyingToBorrow * Math.pow(10, underlyingDecimals)).toString();
  await cToken.methods.borrow(scaledUpBorrowAmount).send(fromMyWallet).then((result) => {
    console.log('done')
  }).catch((error) => {
    console.error('[borrow] error:', error);
  });
  var response = {
    "text": " Borrow balance of DAI borrowed "
  };
  res = JSON.stringify(response);
  return res;
};



exports.checkDAIBalance = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places


  let balance = await cToken.methods.borrowBalanceCurrent(myWalletAddress).call();
  balance = balance / Math.pow(10, underlyingDecimals);
  console.log(`Borrow balance is ${balance} ${assetNameDAI}`);

  var response = {
    "text": " Borrow balance of DAI " + balance
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};



exports.calculateLiquidity = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places


  console.log('Calculating your liquid assets in the protocol...');
  let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(myWalletAddress).call();
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
    "text": ' You can borrow up to :' + liquidity / underlyingPriceInUsd + ' units of ' + assetNameDAI +' from the protocol '
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};


exports.checkAccountcETHBalance = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  console.log('Calculating your liquid assets in the protocol...');
  let { 1: liquidity } = await comptroller.methods.getAccountLiquidity(myWalletAddress).call();
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

  web3.eth.accounts.wallet.add(privateKey);
  const wallet = web3.eth.accounts.wallet[0];
  const myWalletAddress = web3.eth.accounts.wallet[0].address;


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

exports.exchangeRateETHcETH = async function (req, res) {

  web3.eth.accounts.wallet.add(privateKey);
  const wallet = web3.eth.accounts.wallet[0];
  const myWalletAddress = web3.eth.accounts.wallet[0].address;

  const ethDecimals = 18; // Ethereum has 18 decimal places

  let exchangeRateCurrent = await cEth.methods.exchangeRateCurrent().call();
  exchangeRateCurrent = exchangeRateCurrent / Math.pow(10, 18 + ethDecimals - 8);

  var response = {
    "text": " exchange rate (from ETH to cETH) of: " + exchangeRateCurrent

  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};


exports.borrowRateDAI = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  console.log(`Fetching borrow rate per block for ${assetNameDAI} borrowing...`);
  let borrowRate = await cToken.methods.borrowRatePerBlock().call();
  borrowRate = borrowRate / Math.pow(10, underlyingDecimals);
 
  console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetNameDAI} per block.\nThis is based on the current borrow rate.\n`);

  var response = {
    "text": ' borrow rate of ' +  assetNameDAI +' is: ' + borrowRate
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};



exports.borrowRateETH = async function (req, res) {

  const ethDecimals = 18; // Ethereum has 18 decimal places

  console.log(`Fetching borrow rate per block for ${assetNameETH} borrowing...`);
  let borrowRate = await cEth.methods.borrowRatePerBlock().call();
  borrowRate = borrowRate / Math.pow(10, underlyingDecimals);
 
  console.log(`\nYour borrowed amount INCREASES (${borrowRate} * borrowed amount) ${assetNameDAI} per block.\nThis is based on the current borrow rate.\n`);

  var response = {
    "text": ' borrow rate of ' +  assetNameETH +' is: ' + borrowRate
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};

exports.exchangeRateETHUSD = async function (req, res) {

  web3.eth.accounts.wallet.add(privateKey);
  const wallet = web3.eth.accounts.wallet[0];
  const myWalletAddress = web3.eth.accounts.wallet[0].address;


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

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));

  return res;
};


exports.checkCTokenBalance = async function (req, res) {


  let cTokenBalance = await cEth.methods.balanceOf(myWalletAddress).call() / 1e8;

  //const ethBalanceWei = await wallet.getBalance()
  //const ethBalance = ethers.utils.formatEther(ethBalanceWei)

  var response = {
    "text": " balance in cETH " + cTokenBalance
  };

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(response));
  return res;
};


exports.invalidRequest = function (req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Invalid Request');
};
