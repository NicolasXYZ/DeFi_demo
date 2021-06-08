const url = require('url');


// Init with private key (server side)
const Compound = require('@compound-finance/compound-js');
var compound = new Compound('https://mainnet.infura.io/v3/ccb0d808a5b74dcb9db7668888c8a8a6', {
  privateKey: '0xe2225182a8c546e2bf6b4ad10e3567db', // preferably with environment variable
});



exports.exchangeRateBATUSDC = async function (req, res) {
    const reqUrl = url.parse(req.url, true);
    let price;

    price = await compound.getPrice(Compound.BAT, Compound.USDC); // supports cTokens too
    var response = {
        "text": "BAT in USDC" + price
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}; 





exports.invalidRequest = function (req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Invalid Request');
};
