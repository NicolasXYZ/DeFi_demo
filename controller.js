'use strict';
const express = require('express');
const app = express();
const { addAsync } = require('@awaitjs/express');
addAsync(app);
const { wrap } = require('@awaitjs/express');

module.exports = function (app) {

    var service = require('./service.js');

    app.route('/exchangeRateETHcETH')
        .get(service.exchangeRateETHcETH)

    app.route('/checkAccount/ETHBalance')
        .get(service.startAndCheckEther)

    app.route('/checkAccount/cETHBalance')
        .get(service.checkCTokenBalance)

    app.route('/startGanache')
        .get(service.startGanache)

    app.route('/supplyETH/:amount').get(async (req, res) => {

        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        await service.SupplyETH(req.params.amount).then((result) => {
            return res.sendStatus(200);
          }).catch((error) => {
            return res.sendStatus(400);
          });
  
    });

    app.route('/checkCTokenBalance')
        .get(service.checkAccountcETHBalance)

    app.route('/getCollateralFactor/cETH')
        .get(service.getCollateralFactor)

    app.route('/exchangeRateETHUSD')
        .get(service.exchangeRateETHUSD)

    app.route('/checkAccount/DAIBalance')
        .get(service.checkDAIBalance)

    app.route('/borrowDAI')
        .get(service.borrowDAI)

    app.route('/calculateLiquidity')
        .get(service.calculateLiquidity)


};
