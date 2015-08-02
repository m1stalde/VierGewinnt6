/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/express/express.d.ts"/>
/// <reference path="../typings/body-parser/body-parser.d.ts"/>

import express = require('express');
import bodyParser = require('body-parser');
//import session = require('express-session');


var app = express();

app.use(require('cookie-parser')());
//app.use(session({ secret: 'casduichasidbnuwezrfinasdcvjkadfhsuilfuzihfioda', resave: false, saveUninitialized: true}));

//app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello TypeScript')
});

// TODO require().Router() should only be require()
app.use('/users', require('./routes/userRoutes').Router());
app.use('/session', require('./routes/sessionRoutes').Router());
app.use("/lobby", require('./routes/lobbyRoutes.js').Router()),

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/../../client/build/app'));

var port: number = +process.env.PORT || 2999;

var server = app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
