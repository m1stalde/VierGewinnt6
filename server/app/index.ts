/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>

import express = require('express');

var app = express();

app.get('/', (req, res) => {
    res.send('Hello TypeScript')
});

var port: number = +process.env.PORT || 3000;

var server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
