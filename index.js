const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const router = express.Router();
const apiRoutes = require('./api');

console.log('——————————- Run on port '+ port);

/****************************** Router ***************************/
router.get('*', function(req, res){
    res.sendFile('index.html', { root: __dirname + '/dist/' });
});

/****************************** /Router ***************************/

//app.use(morgan('dev')); // log every request to the console
app.use(express.static(__dirname + '/dist')); // Static (public) folder

app.use(bodyParser.urlencoded({extended:true}));// get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use('/api', apiRoutes);
app.use('/', router);

app.listen(port);