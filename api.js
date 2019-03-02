const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Client } = require('pg');
const fs = require('fs');
const mustache = require('mustache');
const Styliner = require('styliner');

const client = new Client({
   connectionString: process.env.DATABASE_URL,
   ssl: true
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

let styliner = new Styliner(__dirname + '/emails');
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
    client.query('SELECT * FROM guests WHERE attending IS NOT NULL', (err, response) => {
        console.log(err, response);
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

function sendEmail(email, template, subject, res, options, view) {
    let mailOptions = options || {};
    console.log("Sending email to " + email);
    const html = mustache.render(template, view);

    mailOptions.from = 'irinadesmond@gmail.com';
    mailOptions.to = email;
    mailOptions.subject = subject;
    mailOptions.html = html;

    transporter.sendMail(mailOptions, function(error, success) {
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
                        sendEmail(guest.contact_email, data, "Wedding Invite");
                    }
                }

                res.send({message});
            }
        });
    });
});

router.post('/emailGuest', (req, res) => {
    const email = req.body.email;
    fs.readFile(__dirname + '/emails/email.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        // console.log(data);
        sendEmail(email, data, "Wedding Invite", res);
    });
});


router.post('/emailGuestRSVPResponse', (req, res) => {
    const emailAddress = req.body.email;
    fs.readFile(__dirname + '/emails/rsvpThankYou.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        styliner.processHTML(data)
            .then((email) => {
                let mailOptions = {
                    attachments: [
                        {
                            filename: 'RSVP_heart.png',
                            path: 'frontend/src/assets/images/RSVP_heart.png',
                            cid: 'unique1@kreata.ee'
                        },
                        {
                            filename: 'HenaghenEverAfter.png',
                            path: 'frontend/src/assets/images/HenaghenEverAfter.png',
                            cid: 'unique2@kreata.ee'
                        }]
                };

                // console.log(data);
                sendEmail(emailAddress, email, "Thanks for RSVPing", res, mailOptions);
            });
    });
});


router.post('/emailGuestSTDResponse', (req, res) => {
    const emailAddress = req.body.email;
    console.log("Trying to email "+emailAddress+" STD");
    fs.readFile(__dirname + '/emails/STDResponse.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }


        styliner.processHTML(data)
            .then((email) => {
                let mailOptions = {
                    attachments: [
                        {
                            filename: 'RSVP_heart.png',
                            path: 'frontend/src/assets/images/RSVP_heart.png',
                            cid: 'unique1@kreata.ee'
                        },
                        {
                            filename: 'HenaghenEverAfter.png',
                            path: 'frontend/src/assets/images/HenaghenEverAfter.png',
                            cid: 'unique2@kreata.ee'
                        }]
                };

                // console.log(data);
                sendEmail(emailAddress, email, "Thanks for letting us know if you could make it", res, mailOptions);
            });
    });
});


router.post('/sendSTD', (req, res) => {
    const guest = req.body.guest;
    const plusOne = req.body.plusOne;

    // console.log("PLUSONE");
    // console.log(plusOne);

    let query =
        'UPDATE guests ' +
        'SET contact_email=$1, contact_phone=$2, attending=$3, plus_one_needed=$4 ' +
        'WHERE id=$5';
    let values = [guest.contact_email, guest.contact_phone, guest.attending, guest.plusOneNeeded, guest.id];

    client.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (plusOne) {
                client.query(
                    'INSERT INTO plus_ones(first_name, last_name, contact_email, contact_phone, main_guest_id, use_main_contact_info) ' +
                    'VALUES ($1, $2, $3, $4, $5, $6) ' +
                    'ON CONFLICT (main_guest_id) DO UPDATE ' +
                    'SET first_name=$1, last_name=$2, contact_email=$3, contact_phone=$4, use_main_contact_info=$6',
                    [plusOne.firstname, plusOne.lastname, plusOne.contact_email, plusOne.contact_phone, plusOne.main_guest_id, plusOne.use_main_contact_info], (err2, result2) => {
                   if (err2) {
                       console.log(err2);
                       res.send(err2);
                   } else {
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
    console.log(guest);
    client.query(
        'SELECT id, plus_one_offered, first_name, last_name ' +
        'FROM guests ' +
        'WHERE trim(lower(first_name))=$1 AND trim(lower(last_name))=$2 ' +
        'LIMIT 1',
        [cleanString(guest.first_name), cleanString(guest.last_name)], (err, result) => {
        if (err) {
            console.error(err.stack);
            res.send("Failed");
        } else {
            console.log(result);
            console.log(result.rows[0]);
            if (result.rows.length > 0) {
                res.send(result.rows[0]);
            } else {
                res.send({id: 0});
            }
        }
    });
});

function cleanString(string) {
    return string.trim().toLowerCase();
}

module.exports = router;