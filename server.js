//require('newrelic');
var compression = require('compression');
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');
var config         = require('./config/config');
var port           = config.web.port;

// Middlewares
var allowCrossDomain = function(req, res, next) {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
 res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
 if ('OPTIONS' == req.method)res.sendStatus(200);else next();
};

app.use(compression());
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var api = express.Router();
api.get('/', function(req, res) {
 res.send('<html><body></body></html>');
});

app.use(api);

mongoose.connect(config.dbEndpoint, config.dbOptions).then(function(){
    console.log('Connected to Database');
}).catch(function(err){
    console.log(err);
});

// Import Models and Controllers
var models = require('./models');
var accountCtrl = require('./controllers/account');

// API routes
app.use('/api', api);
api.route('/account/:number').get(accountCtrl.getAccount);


// Start server
app.listen(port, function() {
 console.log("Node server running on port " + port);
});
