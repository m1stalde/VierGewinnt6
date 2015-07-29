/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
/// <reference path="../typings/body-parser/body-parser.d.ts"/>

import express = require('express');
import bodyParser = require('body-parser');

var app = express();

//app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello TypeScript')
});

// TODO require().Router() should only be require()
app.use("/users", require('./routes/userRoutes.js').Router());

app.use(express.static(__dirname + '/public'))

var port: number = +process.env.PORT || 3000;

var server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
