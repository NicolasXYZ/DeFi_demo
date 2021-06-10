'use strict';
const express = require('express');
const app = express();
const { addAsync } = require('@awaitjs/express');
addAsync(app);
const { wrap } = require('@awaitjs/express');

module.exports = function (app) {

    app.route('/UserSelection/:userID').get((req, res) => {
        if (isNaN(req.params.userID)||(req.params.userID<0)||(req.params.userID>9)) {
            return res.sendStatus(400);
        }
        app.locals.user = req.params.userID
        console.dir((app.locals.user));
        return res.sendStatus(200);
    });
        
    var service = require('./service.js');

    app.route('/checkAccount/ETHBalance').get(async (req, res) => {
        await service.startAndCheckEther(parseInt(app.locals.user)).then((result) => {
            return res.send(result);
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/supplyETH/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        await service.SupplyETH(parseInt(app.locals.user)，req.params.amount).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });

    /*
    
        app.route('/supplyRateDAI')
            .get(service.supplyRateDAI)
    
    
        app.route('/supplyRateETH')
            .get(service.borrowRateETH)
    
        app.route('/exchangeRatecDAIcETH')
            .get(service.exchangeRatecDAIcETH)
    
        app.route('/exchangeRateDAIcDAI')
            .get(service.exchangeRateDAIcDAI)
    
        app.route('/redeemETH/:amount')
            .get(service.redeemETH)
    
        app.route('/redeemDAI/:amount')
            .get(service.redeemDAI)
    
        app.route('/borrowETH/:amount').get(async (req, res) => {
            if (isNaN(req.params.amount)) {
                return res.sendStatus(400);
            }
            await service.borrowETH(req.params.amount).then((result) => {
                return res.sendStatus(200);
            }).catch((error) => {
                return res.sendStatus(400);
            });
        });
    
    
        app.route('/repayETH/:amount').get(async (req, res) => {
            if (isNaN(req.params.amount)) {
                return res.sendStatus(400);
            }
            await service.repayETH(req.params.amount).then((result) => {
                return res.sendStatus(200);
            }).catch((error) => {
                return res.sendStatus(400);
            });
        });
    
    
        app.route('/repayDAI/:amount').get(async (req, res) => {
            if (isNaN(req.params.amount)) {
                return res.sendStatus(400);
            }
            await service.repayDAI(req.params.amount).then((result) => {
                return res.sendStatus(200);
            }).catch((error) => {
                return res.sendStatus(400);
            });
        });
        app.route('/checkAccount/cDAIBalance')
            .get(service.checkcDAIBalance)
    
        app.route('/supplyDAI/:amount').get(async (req, res) => {
            if (isNaN(req.params.amount)) {
                return res.sendStatus(400);
            }
            await service.SupplyETH(req.params.amount).then((result) => {
                return res.sendStatus(200);
            }).catch((error) => {
                return res.sendStatus(400);
            });
        });
    */
    ////////////////////////////////////////


    app.route('/borrowRateETH')
        .get(service.borrowRateETH)

    app.route('/borrowRateDAI')
        .get(service.borrowRateDAI)

    app.route('/exchangeRateETHcETH')
        .get(service.exchangeRateETHcETH)


    app.route('/checkAccount/cETHBalance')
        .get(service.checkCTokenBalance)

    app.route('/startGanache')
        .get(service.startGanache)

    app.route('/checkCTokenBalance')
        .get(service.checkAccountcETHBalance)

    app.route('/getCollateralFactor/cETH')
        .get(service.getCollateralFactor)

    app.route('/exchangeRateETHUSD')
        .get(service.exchangeRateETHUSD)

    app.route('/checkAccount/DAIBalance')
        .get(service.checkDAIBalance)

    app.route('/borrowDAI/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        await service.borrowDAI(req.params.amount).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });

    app.route('/calculateLiquidity')
        .get(service.calculateLiquidity)

};
