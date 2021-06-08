const url = require('url');
const { address } = require('./controller');


// Init with private key (server side)
const Compound = require('@compound-finance/compound-js');

//var compound = new Compound('https://mainnet.infura.io/v3/ccb0d808a5b74dcb9db7668888c8a8a6', {
 // privateKey: '0xe2225182a8c546e2bf6b4ad10e3567db', // preferably with environment variable
//});

var compound = new Compound('http://127.0.0.1:8545'); 


exports.sampleRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var name = 'World';
    if (reqUrl.query.name) {
        name = reqUrl.query.name
    }

    var response = {
        "text": "Hello " + name
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};


exports.accountBalanceCheck = async function (req, address, res) {
    const reqUrl = url.parse(req.url, true);
    const account = await Compound.api.account({
        "addresses": address,
        "network": mainnet
    });

    let daiBorrowBalance = 0;
    if (Object.isExtensible(account) && account.accounts) {
      account.accounts.forEach((acc) => {
        acc.tokens.forEach((tok) => {
          if (tok.symbol === Compound.cDAI) {
            daiBorrowBalance = +tok.borrow_balance_underlying.value;
          }
        });
      });
    }

    var response = {
        "text": "dai Borrow Balance" + daiBorrowBalance
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};

exports.getExchangeRatesBATUSDC = async function (res) {
    let price;

    price = await compound.getPrice(Compound.BAT, Compound.USDC); // supports cTokens too
    var response = {
        "text": "BAT in USDC" + price
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}; 