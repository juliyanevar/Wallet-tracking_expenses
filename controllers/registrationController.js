const fs = require('fs');
const sequelize = require("../connection/db_connection.js");
const {User, Expense, Income, ExpenseCategory, IncomeCategory} = require('../models/db_schema.js').ORM(sequelize);
const mailer = require("../nodeMailer/nodeMailer");
const random = require("../nodeMailer/generateRandom");
const arrayUtil = require('../util/arrayUtil');
let codes = [];

exports.getPage = function (req, res) {
    let view = fs.readFileSync('./views/getCode.html', "utf8");
    res.send(view);
}

exports.sendCode = async function (req, res) {
    const user = await User.findOne({where: {googleId: req.body.googleId}});
    if (user === null) {
        let code;
        do {
            code = random.generate(6);
        } while (codes.includes(code));
        codes.push(code);
        console.log(codes);
        mailer.send(code, req.body.googleId);
        res.send('<p>Email sanded!</p>');
    } else {
        res.send('<p>User with this email already exists!</p>')
    }
}

exports.addUser = async function (req, res) {
    const user = await User.findOne({where: {username: req.body.username}});
    if (user === null) {
        if (codes.includes(req.body.code)) {
            User.create({username: req.body.username, googleId: req.body.googleId})
                .catch((err) => console.log('Error: ' + err.message));
            arrayUtil.removeA(codes, req.body.code);
            res.end(fs.readFileSync('./views/start.html'));
        } else {
            res.send('wrong_code');
        }
    } else {
        res.send('username_exists');
    }

}
