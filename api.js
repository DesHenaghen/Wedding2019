const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Client } = require('pg');
const fs = require('fs');
const mustache = require('mustache');
const Styliner = require('styliner');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const client = new Client({  user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432
    // connectionString: process.env.DATABASE_URL,
    // ssl: true
});

let poolConfig = {
    pool: true,
    service: 'gmail',
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

router.post('/auth', function(req, res) {
    const body = req.body;
    client.query('SELECT * FROM admin where username=$1 AND password=$2',[body.username, body.password], (err, response) => {
        if (response.rows  && response.rows.length > 0) {
            const token = jwt.sign({username: body.username}, 'wedding-secret', {expiresIn: '2h'});
            res.send({token});
        } else {
            res.sendStatus(401);
        }
    });
});

router.get('/guests', function (req, res) {
    client.query('SELECT \'true\' guest, * FROM guests', (error, response) => {
        //console.log(err, response);
        if (error) {
            console.error(error);
            response.err(error);
        } else {
            client.query('SELECT \'false\' guest, * FROM plus_ones', (err, response2) => {
                //console.log(err, response);
                if (err) {
                    console.error(err);
                    res.err(err);
                } else {
                    res.send(response2.rows.concat(response.rows));
                }
            });
        }
    });
});

router.get('/guest', function (req, res) {
    console.log("GUEST", req.query);
    client.query('SELECT first_name, last_name FROM guests where id = $1', [req.query.id], (err, response) => {
        if (err) {
            console.error(err);
            res.err(err);
        }
        res.send(response.rows[0]);
    });
});

router.get('/plusOne', function (req, res) {
    console.log("PLUS ONE", req.query);
    client.query('SELECT first_name, last_name FROM plus_ones where id = $1', [req.query.id], (err, response) => {
        if (err) {
            console.error(err);
            res.err(err);
        }
        res.send(response.rows[0]);
    });
});

// define the about route
router.post('/addGuest', (req, res) => {
    let guest = req.body.guest;

    client.query('INSERT INTO guests (first_name, last_name, contact_email, attending, meal_choice, extra_info, contact_phone, plus_one_offered, plus_one_needed, attending_ceremony) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *', [
        guest.first_name, guest.last_name, guest.contact_email, guest.attending, guest.meal_choice,
        guest.extra_info, guest.contact_phone, guest.plus_one_offered, guest.plus_one_needed, guest.attending_ceremony
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
       'SET first_name=$1, contact_email=$2, attending=$3, meal_choice=$4, extra_info=$5, contact_phone=$6, last_name=$7, plus_one_offered=$8, plus_one_needed=$9, attending_ceremony=$10 ' +
       'WHERE id=$11',
       [ guest.first_name, guest.contact_email, guest.attending, guest.meal_choice, guest.extra_info, guest.contact_phone,
           guest.last_name, guest.plus_one_offered, guest.plus_one_needed, guest.attending_ceremony, guest.id ], (err, result) => {
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
    fs.readFile(__dirname + '/emails/email.html', 'utf8', function (err,data) {
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
                for(let guest of Object.values(result.rows)) {
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
    let values = [guest.contact_email, guest.contact_phone, guest.attending, guest.plus_one_needed, guest.id];

    client.query(query, values, (err, result) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (plusOne) {
                client.query(
                    'INSERT INTO plus_ones(first_name, last_name, contact_email, contact_phone, main_guest_id, use_main_contact_info)' +
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

router.post('/sendInvite', (req, res) => {
    const email = req.body.email;
    fs.readFile(__dirname + '/emails/invite.html', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        // console.log(data);
        sendEmail(email, data, "Invite to Irina & Desmond's Wedding", res, {}, {name: req.body.name, url: req.body.url});
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