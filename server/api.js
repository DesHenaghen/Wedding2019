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

router.post('/sendSTD', (req, res) => {
    const guest = req.body.guest;
    const plusOne = req.body.plusOne;

    // console.log(req.body);

    let query = 'INSERT INTO guests(name, contact_email, attending, main_contact) VALUES($1, $2, $3, $4) RETURNING *';
    let values = [guest.name, guest.contact_email, guest.attending, null];

    // if (plusOne) {
    //     query += ', ($5, $6, $7, $8)';
    //     values.push(...[plusOne.name, plusOne.contact_email, plusOne.attending]);
    // }

    client.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            // console.log("result 1");
            // console.log(result);
            if (plusOne) {
                client.query(query, [plusOne.name, plusOne.contact_email, plusOne.attending, (plusOne.main_contact)?result.rows[0].id:null], (err2, result2) => {
                   if (err2) {
                       console.log(err2);
                       res.send(err2);
                   } else {
                       // console.log("result 2");
                       // console.log(result2);
                       res.send({message: 'Logged multiple save the date responses'});
                   }
                });
            } else {
                res.send({message: 'Logged Save the Date response'});
            }
        }
    });
});

router.post('/guestExists', (req, res) => {
    let guest = req.body.guest;
    client.query(
        'SELECT 1 ' +
        'FROM guests ' +
        'WHERE lower(first_name)=$1 AND lower(last_name)=$2',
        [cleanString(guest.firstname), cleanString(guest.lastname)], (err, result) => {
        if (err) {
            console.error(err.stack);
            res.send("Failed");
        } else {
            console.log(result.rows);
            if (result.rows.length > 0) {
                res.send(true);
            } else {
                res.send(false);
            }
        }
    });
});

function cleanString(string) {
    return string.trim().toLowerCase();
}

module.exports = router;