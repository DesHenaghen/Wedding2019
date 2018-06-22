const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Client } = require('pg');
const fs = require('fs');
const mustache = require('mustache');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'wedding',
    password: 'postgres',
    port: 5432,
});

let poolConfig = {
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use TLS
    auth: {
        user: 'irinadesmond@gmail.com',
        pass: 'Montoya87.'
    }
};

let transporter = nodemailer.createTransport(poolConfig);

transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

client.connect();

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next()
});

// define the home page route
router.get('/guests', function (req, res) {
    client.query('SELECT * FROM guests', (err, response) => {
        // console.log(err, response);
        res.send(response.rows);
    });
});

// define the about route
router.post('/addGuest', (req, res) => {
    let guest = req.body.guest;

    client.query('INSERT INTO guests VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *', [
        guest.name, guest.contact_email, guest.can_attend, guest.meal_choice,
        guest.extra_info, guest.contact_phone, guest.main_contact
    ], (err, result) => {
        if (err) {
            console.error(err.stack)
        } else {
            // console.log(result);
            res.send(result.rows[0]);
        }
    })
});

router.post('/removeGuest', (req, res) => {
    client.query('DELETE FROM guests WHERE id = $1', [req.body.id], (err, result) => {
        if (err) {
            console.error(err.stack);
            res.send("Failed");
        } else {
            // console.log(result);
            res.send({message: "Deleted"});
        }
    })
});

router.post('/updateGuest', (req, res) => {
    let guest = req.body.guest;

   client.query('UPDATE guests ' +
       'SET name=$1, contact_email=$2, can_attend=$3, meal_choice=$4, extra_info=$5, contact_phone=$6, main_contact=$7 ' +
       'WHERE id=$8',
       [ guest.name, guest.contact_email, guest.can_attend, guest.meal_choice,
           guest.extra_info, guest.contact_phone, guest.main_contact, guest.id ], (err, result) => {
           if (err) {
               console.error(err.stack);
               res.send("Failed");
           } else {
               // console.log(result);
               res.send({message: "Updated"});
           }
       });
});

function sendEmail(email, data, res) {
    let view = {
        guests: [
            {name: email},
            {name: 'tester'}
        ]
    };
    const html = mustache.render(data, view);

    const message = {
        from: 'irinadesmond@gmail.com',
        to: email,
        subject: 'Wedding Invite',
        // text: 'Plaintext version of the message',
        html
    };
    transporter.sendMail(message, function(error, success) {
        if (error) {
            console.log(error);
            if (res) res.send("nope");
            else return false;
        } else {
            console.log('Successfully sent an email', success);
            if (res) res.send({message: "Email sent to " + email });
            else return true;
        }
    });
}

router.get('/emailAll', (req, res) => {
    fs.readFile(__dirname + '/email.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        let message = "All guests emailed successfully";

        // console.log(data);
        client.query('SELECT * FROM guests', (err, result) => {
            let guests = {};
            if (err) {
                console.error(err.stack);
                res.send("Failed");
            } else {
                // console.log(result);
                result.rows.forEach(row => {
                    if (row.main_contact) {
                        if (!guests[row.main_contact]) {
                            guests[row.main_contact] = {others: []};
                        }

                        guests[row.main_contact].others.push(row);
                    } else {
                        if (!guests[row.id]) {
                            row.others = [];
                        } else {
                            row.others = guests[row.id].others;
                        }

                        guests[row.id] = row;
                    }
                });

                for(let guest of Object.values(guests)) {
                    console.log(guest);
                    if (guest.contact_email) {
                        sendEmail(guest.contact_email, data, null);
                    }
                }

                res.send({message});
            }
        });
    });
});

router.post('/emailGuest', (req, res) => {
    const email = req.body.email;
    fs.readFile(__dirname + '/email.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        // console.log(data);
        sendEmail(email, data, res);
    });
});

module.exports = router;