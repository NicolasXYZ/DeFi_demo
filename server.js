const express = require('express');
const app = express();
const { addAsync } = require('@awaitjs/express');
addAsync(app);


port = process.env.PORT || 3000;

var routes = require('./controller.js'); //importing route
routes(app); //register the route


app.listen(port);

app.use(`/`, express.static(`defiui`));

console.log('DeFi sandbox demo server started on: ' + port);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
  });