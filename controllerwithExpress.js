var express = require('express');
var app = express();
app.route('/exchangeRateBATUSDC').get(exchangeRateBATUSDC(req,res)
{
    res.send("Tutorial on Node");
});

app.route('/Angular').get(function(req,res)
{
    res.send("Tutorial on Angular");
});

app.get('/',function(req,res){
    res.send('Welcome to our DeFi compound');
});
