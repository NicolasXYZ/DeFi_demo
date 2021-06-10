const http = require('http');
const url = require('url');

module.exports = http.createServer((req, res) => {

    var service = require('./service.js');
    const reqUrl = url.parse(req.url, true);

    // GET Endpoint for exchange rate



    if (reqUrl.pathname == '/exchangeRateETHcETH' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.exchangeRateETHcETH(req, res);

    } else if (reqUrl.pathname == '/checkAccount/ETHBalance' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.startAndCheckEther(req, res);

    }  else if (reqUrl.pathname == '/checkAccount/cETHBalance' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.checkCTokenBalance(req, res);

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

    } else if (reqUrl.pathname == '/checkCTokenBalance' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.checkAccountcETHBalance(req, res);

    }

    else if (reqUrl.pathname == '/getCollateralFactor/cETH' && req.method === 'GET') {
    console.log('Request Type:' +
        req.method + ' Endpoint: ' +
        reqUrl.pathname);

    service.getCollateralFactor(req, res);

}
else if (reqUrl.pathname == '/exchangeRateETHUSD' && req.method === 'GET') {
    console.log('Request Type:' +
        req.method + ' Endpoint: ' +
        reqUrl.pathname);

    service.exchangeRateETHUSD(req, res);

}
    else if (reqUrl.pathname == '/checkAccount/DAIBalance' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.checkDAIBalance(req, res);

    }

    else if (reqUrl.pathname == '/borrowDAI' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.borrowDAI(req, res);

    } 

    else if (reqUrl.pathname == '/calculateLiquidity' && req.method === 'GET') {
        console.log('Request Type:' +
            req.method + ' Endpoint: ' +
            reqUrl.pathname);

        service.calculateLiquidity(req, res);

    } else {
        console.log('Request Type:' +
            req.method + ' Invalid Endpoint: ' +
            reqUrl.pathname);

        service.invalidRequest(req, res);

    }
});
