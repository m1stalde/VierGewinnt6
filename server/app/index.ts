/// <reference path="_all.ts"/>
'use strict';

// set up ==========================================
import express = require('express');
import bodyParser = require('body-parser');
import security = require('./utils/security');
import logger = require('./utils/logger');
import errors = require('./utils/errors');

var http = require('http').Server(express);
var websocketService = require('./websocket/websocketService.js');


// configuration ==========================================
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
security.init(app);


app.get('/', (req, res) => {
    res.redirect('/index.html');
});

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers['origin']);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.options('*', function(req, res) {
    res.sendStatus(200);
});

// register routes
app.use('/users', require('./routes/userRoutes'));
app.use('/session', require('./routes/sessionRoutes'));
app.use("/lobby", require('./routes/lobbyRoutes'));
app.use("/game", require('./routes/gameRoutes'));

app.use(express.static(__dirname + '/public'));


// generic error handler after routes
app.use(function(err: any, req: express.Request, res: express.Response, next: Function): any {
    if (err instanceof errors.NotFoundError) {
        logger.info(err);
        res.status(404).send(err.message);
    } else {
        logger.error(err.stack);
        res.status(500).send('Request failed: ' + err.message);
    }
});

var port: number = process.env.PORT || 2999;
var host: string = process.env.HOST || '0.0.0.0'; // listen on all ip addresses per default

var server = app.listen(port, host, function() {
    logger.info('Express server listening on ' + host + ':' + port);
});


var wsSocketServer = websocketService.setUpWebsocketService(server);

