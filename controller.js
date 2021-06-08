const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    var service = require('./serviceInProgess copy.js');
    const reqUrl = url.parse(req.url, true);

    // GET Endpoint for exchange rate
    if (reqUrl.pathname == '/exchangeRateBATUSDC' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.exchangeRateBATUSDC(req, res);

    } else if (reqUrl.pathname == '/checkAccount' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.startAndCheckEther(req, res);

    } else if (reqUrl.pathname == '/startGanache' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.startGanache(req, res);

    } else if (reqUrl.pathname == '/supplyETH' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.SupplyETH(req, res);

    } else {
        console.log('Request Type:' +
            req.method + ' Invalid Endpoint: ' +
            reqUrl.pathname);

        service.invalidRequest(req, res);

    }
});
