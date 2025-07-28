const mailRouter = require('express').Router();
const nodemailer = require('nodemailer');

/*mailRouter.get('/', (req, res) => {
    res.send("Saadame kasutajale maili!")
})*/

mailRouter.post('/mail', async (req, res) => {
    const { email, sender, message } = req.body;
    try {
        const url = req.protocol + '://' + req.get('host') + "/#";
        console.log("Url " + url)

        const transporter = nodemailer.createTransport({
            //service: 'gmail',
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: false,
            auth: {
                user:  "prokeikkatori.info@gmail.com",     //'your-email@gmail.com',
                pass:  "wtcblhhdirwmnzfv"         //'your-email-password',
            },
        });
        const mailOptions = {
            from: "prokeikkatori.info@gmail.com",          //'your-email@gmail.com',
            to: email,
            subject: `Uusi viesti käyttäjältä ${sender}`,
            text: message
        };
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Virhe tietojen lähettämisessä!');
            } else {
                console.log(`Email sent: ${info.response}`);
                res.status(200).send('Tiedote lähetetty!');
            }
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Tapahtui virhe!');
    }
})
module.exports = mailRouter;