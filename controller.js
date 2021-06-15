'use strict';
const express = require('express');
const app = express();
const { addAsync } = require('@awaitjs/express');
addAsync(app);
const { wrap } = require('@awaitjs/express');

module.exports = function (app) {

    var service = require('./service.js');

    app.route('/defidemo/dashboard/:trader_id').get(async (req, res) => {
        if (isNaN(req.params.trader_id) || (req.params.trader_id < 1) || (req.params.trader_id > 5)) {
            return res.sendStatus(400);
        }

        app.locals.user = req.params.trader_id - 1
        //console.dir((app.locals.user));
        try {
            var o = {}
            var key = 'eth'
            o[key] = []
            let myWalletethamount = await service.startAndCheckEther(parseInt(app.locals.user))
            let globalethamount = await service.checkSUMAccountsETH()
            let ethrate = await service.borrowRateETH()

            var eth_field = {
                label: 'ETH',
                gAmount: globalethamount,
                wAmount: myWalletethamount,
                rate: ethrate
            }
            o[key].push(eth_field)

            var key2 = 'ceth'
            o[key2] = []
            let myWalletcethamount = await service.checkCTokenBalance(parseInt(app.locals.user))
            myWalletcethamount = myWalletcethamount / Math.pow(10, 3)
            let globalcethamount = await service.checkSUMAccountscETH()
            globalcethamount = globalcethamount / Math.pow(10, 3)
            var ceth_field = {
                label: 'cETH',
                gAmount: globalcethamount,
                wAmount: myWalletcethamount
            }
            o[key2].push(ceth_field)

            var key3 = 'dai'
            o[key3] = []
            let myWalletdaiamount = await service.checknonborrowedDAIBalance(parseInt(app.locals.user))
            myWalletdaiamount = myWalletdaiamount / Math.pow(10, 3)
            let globaldaiamount = await service.checkSUMDAIBalance()
            globaldaiamount = globaldaiamount / Math.pow(10, 3)
            let dairate = await service.borrowRateDAI()

            var dai_field = {
                label: 'DAI',
                gAmount: globaldaiamount,
                wAmount: myWalletdaiamount,
                rate: dairate
            }
            o[key3].push(dai_field)

            var key4 = 'cdai'
            o[key4] = []
            let myWalletcdaiamount = await service.checkcDAIBalance(parseInt(app.locals.user))
            myWalletcdaiamount = myWalletcdaiamount / Math.pow(10, 3)
            let globalcdaiamount = await service.checkSUMAccountscDAI()
            globalcdaiamount = globalcdaiamount / Math.pow(10, 3)
            var cdai_field = {
                label: 'cDAI',
                gAmount: globalcdaiamount,
                wAmount: myWalletcdaiamount
            }
            o[key4].push(cdai_field)

            return res.json(o);
        }
        catch (e) {
            return res.sendStatus(400);
        }
    });



    app.route('/defidemo/trade/:trader_id/:suppyId/:receiverId/:amount').get(async (req, res) => {
        if (isNaN(req.params.trader_id) || (req.params.trader_id < 1) || (req.params.trader_id > 5)) {
            return res.sendStatus(400);
        }

        app.locals.user = req.params.trader_id - 1

        try {
            if (req.params.suppyId.toString() == "eth") {

                if (req.params.receiverId.toString() == "ceth") {

                    let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
                    await service.SupplyETH(newInput).then((result) => {
                        return res.sendStatus(200);
                    }).catch((error) => {
                        return res.sendStatus(400);
                    });

                } else if (req.params.receiverId.toString() == "cdai") {

                    let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
                    await service.repayborrowETH(newInput).then((result) => {
                        return res.sendStatus(200);
                    }).catch((error) => {
                        return res.sendStatus(400);
                    });
                } else {
                    return res.sendStatus(400);
                }
            } else if (req.params.suppyId.toString() == "ceth") {

                if (req.params.receiverId.toString() == "eth") {

                    let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
                    await service.redeemETH(newInput).then((result) => {
                        return res.sendStatus(200);
                    }).catch((error) => {
                        return res.sendStatus(400);
                    });
                } else if (req.params.receiverId.toString() == "dai") {

                    let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
                    await service.borrowDAI(newInput).then((result) => {
                        return res.sendStatus(200);
                    }).catch((error) => {
                        return res.sendStatus(400);
                    });
                } else {
                    return res.sendStatus(400);
                }
            } else if (req.params.suppyId.toString() == "dai") {

                if (req.params.receiverId.toString() == "ceth") {

                    let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
                    await service.repayborrowDAI(newInput).then((result) => {
                        return res.sendStatus(200);
                    }).catch((error) => {
                        return res.sendStatus(400);
                    });

                } else if (req.params.receiverId.toString() == "cdai") {

                    let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
                    await service.supplyDAI(newInput).then((result) => {
                        return res.sendStatus(200);
                    }).catch((error) => {
                        return res.sendStatus(400);
                    });
                } else {
                    return res.sendStatus(400);
                }
            } else if (req.params.suppyId.toString() == "cdai") {

                if (req.params.receiverId.toString() == "dai") {

                    let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
                    await service.redeemDAI(newInput).then((result) => {
                        return res.sendStatus(200);
                    }).catch((error) => {
                        return res.sendStatus(400);
                    });
                } else if (req.params.receiverId.toString() == "eth") {

                    let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
                    await service.borrowETH(newInput).then((result) => {
                        return res.sendStatus(200);
                    }).catch((error) => {
                        return res.sendStatus(400);
                    });
                } else {
                    return res.sendStatus(400);
                }
            } else {
                return res.sendStatus(400);
            }



        }
        catch (e) {
            return res.sendStatus(400);
        }
    });

    app.route('/defidemo/exchange').get(async (req, res) => {

        //console.dir((app.locals.user));
        try {
            var o = {}
            var key = 'rates'
            o[key] = []
            let cethethrate = await service.exchangeRatecETHETH()
            var cetheth_field = {
                from: 'ceth',
                to: 'eth',
                rate: cethethrate
            }
            o[key].push(cetheth_field)

            let cethdairate = await service.exchangeRatecETHDAI()
            var cethdai_field = {
                from: 'ceth',
                to: 'dai',
                rate: cethdairate
            }
            o[key].push(cethdai_field)

            let cdaidairate = await service.exchangeRatecDAIDAI()
            var cdaidai_field = {
                from: 'cdai',
                to: 'dai',
                rate: cdaidairate
            }
            o[key].push(cdaidai_field)

            let cdaiethrate = await service.exchangeRatecDAIETH()
            var cdaieth_field = {
                from: 'cdai',
                to: 'eth',
                rate: cdaiethrate
            }
            o[key].push(cdaieth_field)

            return res.json(o);
        }
        catch (e) {
            return res.sendStatus(400);
        }
    });

    app.route('/defidemo/initAllAccounts').get(async (req, res) => {
        let ganachestarted
        ganachestarted = await service.startGanache().then((result) => {
            console.dir('ganache started')
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });

        await service.initAllfunctions().then((result) => {
            return res.send(result);
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });

    });

    app.route('/initAllAccounts').get(async (req, res) => {

        await service.initAllfunctions().then((result) => {
            return res.send(result);
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/initAllAccounts2').get(async (req, res) => {
        await service.initAllfunctions2().then((result) => {
            return res.send(result);
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/startGanache').get(async (req, res) => {
        await service.startGanache().then((result) => {
            return res.send(result);
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/UserSelection/:userID').get((req, res) => {
        if (isNaN(req.params.userID) || (req.params.userID < 0) || (req.params.userID > 9)) {
            return res.sendStatus(400);
        }
        app.locals.user = req.params.userID
        console.dir((app.locals.user));
        return res.sendStatus(200);
    });


    app.route('/checkAccount/ETHBalance').get(async (req, res) => {
        await service.startAndCheckEther(parseInt(app.locals.user)).then((result) => {
            return res.send(result);
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkSUMAccounts/ETHBalance').get(async (req, res) => {
        await service.checkSUMAccountsETH().then((result) => {
            return res.send(result);
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });


    app.route('/checkSUMAccounts/cETHBalance').get(async (req, res) => {
        await service.checkSUMAccountscETH().then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkSUMAccounts/cDAIBalance').get(async (req, res) => {
        await service.checkSUMAccountscDAI().then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    /*
    app.route('/exchangeRatecETHDAI').get(async (req, res) => {
        await service.exchangeRatecETHDAI().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });
    // cETH/ETH * ETH/DAI (ETH/DAI = ETH/USD= 2554.23 / DAIUSD = underlyingprice
    // IT'S A CST TIMES 1/ETHcETH SO NO NEED OF FUNCTION
    */

    app.route('/exchangeRateETHUSD').get(async (req, res) => {
        await service.exchangeRateETHUSD().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/exchangeRatecDAIDAI').get(async (req, res) => {
        await service.exchangeRatecDAIDAI().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkAccount/cETHBalance').get(async (req, res) => {
        await service.checkCTokenBalance(parseInt(app.locals.user)).then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkAccount/cDAIBalance').get(async (req, res) => {
        await service.checkcDAIBalance(parseInt(app.locals.user)).then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/borrowRateDAI').get(async (req, res) => {
        await service.borrowRateDAI().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/calculateLiquidity').get(async (req, res) => {
        await service.calculateLiquidity(parseInt(app.locals.user)).then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });


    /* IT'S A CST TIMES 1/DAIcDAI !!! it's cDAI/DAI * DAI/ETH
    app.route('/exchangeRatecDAIETH').get(async (req, res) => {
        await service.exchangeRatecDAIETH().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });
*/
    app.route('/exchangeRatecETHETH').get(async (req, res) => {
        await service.exchangeRatecETHETH().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/exchangeRatecETHDAI').get(async (req, res) => {
        await service.exchangeRatecETHDAI().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/exchangeRatecDAIETH').get(async (req, res) => {
        await service.exchangeRatecDAIETH().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkAccount/DAIBalance').get(async (req, res) => {
        await service.checknonborrowedDAIBalance(parseInt(app.locals.user)).then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
            //return res.send((result).toString());

        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkAccount/borrowedDAIBalance').get(async (req, res) => {
        await service.checkDAIBalance(parseInt(app.locals.user)).then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
            //return res.send((result).toString());

        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/borrowRateETH').get(async (req, res) => {
        await service.borrowRateETH().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/supplyETH/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
        await service.SupplyETH(newInput).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });

    app.route('/redeemcETH/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
        await service.redeemETH(newInput).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });


    app.route('/redeemcDAI/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
        await service.redeemDAI(newInput).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });

    app.route('/borrowDAI/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
        await service.borrowDAI(newInput).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });


    app.route('/supplyDAI/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
        await service.supplyDAI(newInput).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });

    app.route('/checkSUMAccounts/DAIBalance').get(async (req, res) => {
        await service.checkSUMDAIBalance().then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
            //return res.send((result).toString());

        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkSUMAccounts/TotalLiquidity').get(async (req, res) => {
        await service.checkSUMAccountsTotalLiquidity().then((result) => {
            return res.send((result / Math.pow(10, 3)).toString());
            //return res.send((result).toString());

        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });


    app.route('/repayborrowDAI/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
        await service.repayborrowDAI(newInput).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });

    app.route('/repayborrowETH/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
        await service.repayborrowETH(newInput).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });

    app.route('/borrowETH/:amount').get(async (req, res) => {
        if (isNaN(req.params.amount)) {
            return res.sendStatus(400);
        }
        let newInput = [req.params.amount * Math.pow(10, 3), parseInt(app.locals.user)];
        await service.borrowETH(newInput).then((result) => {
            return res.sendStatus(200);
        }).catch((error) => {
            return res.sendStatus(400);
        });
    });
    /*


    /////////////// NOT NEEDED FOR SIMPLER VERSION OF DEMO //////////////

        app.route('/supplyRateDAI')
            .get(service.supplyRateDAI)
    
        app.route('/supplyRateETH')
            .get(service.borrowRateETH)
    
    
    */
    ////////////////////////////////////////



    // NOT NEEDED FOR SIMPLER VERSION OF DEMO

    app.route('/checkCTokenBalance')
        .get(service.checkAccountcETHBalance)

    app.route('/getCollateralFactor/cETH')
        .get(service.getCollateralFactor)

};
