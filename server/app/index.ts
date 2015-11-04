/// <reference path="_all.ts"/>

// set up ==========================================
import express = require('express');
import bodyParser = require('body-parser');
import security = require('./utils/security');

var http = require('http').Server(express);
var websocketService = require('./websocket/websocketService.js');


// configuration ==========================================
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
security.init(app);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../../client/build/app'));






app.get('/', (req, res) => {
    res.send('Hello TypeScript')
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



// generic error handler after routes
app.use(function(err: any, req: express.Request, res: express.Response, next: Function): any {
    console.error(err.stack);
    res.status(500).send('Request failed: ' + err.message);
});

var port: number = process.env.PORT || 2999;

var server = app.listen(port, '127.0.0.1', function() {
    console.log('Express server listening on port ' + port);
});


var wsSocketServer = websocketService.setUpWebsocketService(server);

