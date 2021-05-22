const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const sender = 'julianevar2001@gmail.com';
const fs = require('fs');

module.exports.send = function (message, receiver) {
    let password = fs.readFileSync(__dirname+'/mailpassword.txt', 'utf8');
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: sender,
            pass: password
        }
    });

    let mailOptions = {
        from: sender,
        to: receiver,
        subject: 'Verify code',
        text: message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sanded');
        }
    })
};
