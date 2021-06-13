'use strict';
const express = require('express');
const app = express();
const { addAsync } = require('@awaitjs/express');
addAsync(app);
const { wrap } = require('@awaitjs/express');

module.exports = function (app) {

    

    app.route('/initAllAccounts').get(async (req, res) => {
        await service.initAllfunctions().then((result) => {
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

    var service = require('./service.js');

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

    app.route('/exchangeRateETHUSD').get(async (req, res) => {
        await service.exchangeRateETHUSD().then((result) => {
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

    app.route('/exchangeRateETHcETH').get(async (req, res) => {
        await service.exchangeRateETHcETH().then((result) => {
            return res.send(result.toString());
        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });


    app.route('/checkAccount/DAIBalance').get(async (req, res) => {
        await service.checknonborrowedDAIBalance(parseInt(app.locals.user)).then((result) => {
                return res.send((result/ Math.pow(10, 3)).toString());
            //return res.send((result).toString());

        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkAccount/borrowedDAIBalance').get(async (req, res) => {
        await service.checkDAIBalance(parseInt(app.locals.user)).then((result) => {
                return res.send((result/ Math.pow(10, 3)).toString());
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
                return res.send((result/ Math.pow(10, 3)).toString());
            //return res.send((result).toString());

        }).catch((error) => {
            console.log(error)
            return res.sendStatus(400);
        });
    });

    app.route('/checkSUMAccounts/TotalLiquidity').get(async (req, res) => {
        await service.checkSUMAccountsTotalLiquidity().then((result) => {
                return res.send((result/ Math.pow(10, 3)).toString());
            //return res.send((result).toString());

        }).catch((error) => {
            console.log(error)
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
        repayBorrw x 2
        in init add supplyDAI, borrowETH, and maybe the two repay Borrow ?

        app.route('/exchangeRatecDAIcETH')
            .get(service.exchangeRatecDAIcETH)
    
        app.route('/exchangeRateDAIcDAI')
            .get(service.exchangeRateDAIcDAI)
    

    /////////////// NOT NEEDED FOR SIMPLER VERSION OF DEMO //////////////

        app.route('/supplyRateDAI')
            .get(service.supplyRateDAI)
    
        app.route('/supplyRateETH')
            .get(service.borrowRateETH)
    
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
    
    */
    ////////////////////////////////////////



    // NOT NEEDED FOR SIMPLER VERSION OF DEMO

    app.route('/checkCTokenBalance')
        .get(service.checkAccountcETHBalance)

    app.route('/getCollateralFactor/cETH')
        .get(service.getCollateralFactor)

};
