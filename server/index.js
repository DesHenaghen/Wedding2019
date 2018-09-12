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
    res.sendFile('index.html', { root: __dirname + '/dist/wedding2018/' });
});

/****************************** /Router ***************************/

//app.use(morgan('dev')); // log every request to the console
app.use(express.static(__dirname + '/dist/wedding2018')); // Static (public) folder

app.use(bodyParser.urlencoded({extended:true}));// get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use('/api', apiRoutes);
app.use('/', router);

app.listen(port);

// const express = require('express');
// const app = express();
// const path = require('path');
// const port = 3000;
//
//
// const { Client } = require('pg');
// const client = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'wedding',
//     password: 'postgres',
//     port: 5432
// });
//
// client.connect();
//
// client.query('SELECT * FROM guests', (err, res) => {
//     console.log(err ? err.stack : res.rows[0]); // Hello World!
//     client.end();
// });
//
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname + '/../wedding2018/dist/wedding2018/index.html'));
// });
//
// app.get('/:filename', (req, res) => {
//     res.sendFile(path.join(__dirname + '/../wedding2018/dist/wedding2018/' + req.params.filename))
// });
//
// app.use((err, request, response, next) => {
//     // log the error, for now just console.log
//     console.log("tuturu", err);
//     // response.status(500).send('Something broke!');
//     response.redirect("/");
// });
//
// app.listen(port, (err) => {
//     if (err) {
//         return console.log('something bad happened', err)
//     }
//
//     console.log(`server is listening on ${port}`)
// });
