/// <reference path="_all.ts"/>

// set up ==========================================
import express = require('express');
import bodyParser = require('body-parser');
var http = require('http').Server(express);
import session = require('express-session');
var websocketService = require('./services/websocketService.js')


// configuration ==========================================

var app = express();
app.use(require('cookie-parser')());

app.use(session({ secret: 'casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda', resave: false, saveUninitialized: true}));
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello TypeScript')
});
// allow request from different domain
/*app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
});*/

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.orgin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});
app.options('*', function(req, res) {
    res.sendStatus(200);
});
// TODO require().Router() should only be require()
app.use('/users', require('./routes/userRoutes').Router());
app.use('/session', require('./routes/sessionRoutes').Router());
app.use("/lobby", require('./routes/lobbyRoutes').Router());

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../../client/build/app'));
var port: number = process.env.PORT || 2999;

var server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});

var WebsocketService = websocketService.WebsocketService;
var instWebSocketServ = new WebsocketService();
instWebSocketServ.setUpWebsocketService(server);
