const sequelize = require("../connection/db_connection.js");
const Sequelize = require('sequelize');
const {User, Expense, Income, ExpenseCategory, IncomeCategory} = require('../models/db_schema.js').ORM(sequelize);
const Op = Sequelize.Op;

exports.getExpenses = function (req, res) {
    if (req.user) {
        Expense.findAll().then(expense => res.send(JSON.stringify(expense)))
            .catch((err) => console.log('Error: ' + err.message));
    } else res.redirect('/');
};

exports.addExpense = function (req, res) {
    if (req.user) {
        Expense.create({
            user: req.user.username,
            amount: req.body.amount,
            date: req.body.date,
            category: req.body.category,
            description: req.body.description
        })
            .catch((err) => console.log('Error: ' + err.message));
        res.send();
    } else res.redirect('/');
};

exports.updateExpense = function (req, res) {
    if (req.user) {
        Expense.update(
            {
                user: req.req.user.username,
                amount: req.body.amount,
                date: req.body.date,
                categoryId: req.body.categoryId,
                description: req.body.description
            },
            {where: {id: req.body.id}}
        ).catch((err) => console.log('Error: ' + err.message));
    } else res.redirect('/');
};

exports.deleteExpense = function (req, res) {
    if (req.user) {
        Expense.destroy({where: {id: req.body.id}})
            .catch((err) => console.log('Error: ' + err.message));
    } else res.redirect('/');
}

exports.getUsersExpenses = function (req, res) {
    if (req.user) {
        Expense.findAll({
            where: {user: req.user.username},
            order: [['date', 'DESC']]
        })
            .then(expense => res.send(JSON.stringify(expense)))
            .catch((err) => console.log('Error: ' + err.message));
    } else res.redirect('/');
}

exports.getUsersExpensesSum = function (req, res) {
    if (req.user) {
        if (req.body.time == 'month') {
            let date = new Date();
            let month = date.getMonth();
            let year = date.getFullYear();
            let endDay;
            switch (month) {
                case '0':
                case '2':
                case '4':
                case '6':
                case '7':
                case '9':
                case '11':
                    endDay = 31;
                    break;
                case '1':
                    endDay = 28;
                default:
                    endDay = 30;
            }
            let startDate = new Date(year, month, 1);
            let endDate = new Date(year, month, endDay);
            Expense.findAll({
                where: {user: req.user.username, date: {[Op.between]: [startDate, endDate]}},
                attributes: ['category',
                    [Sequelize.fn('sum', Sequelize.col('amount')), 'amount']],
                group: ["category"]
            })
                .then(expense => {
                    res.send(JSON.stringify(expense))
                })
                .catch((err) => console.log('Error: ' + err.message));
        } else {
            Expense.findAll({
                where: {user: req.user.username},
                attributes: ['category',
                    [Sequelize.fn('sum', Sequelize.col('amount')), 'amount']],
                group: ["category"]
            })
                .then(expense => {
                    res.send(JSON.stringify(expense))
                })
                .catch((err) => console.log('Error: ' + err.message));
        }
    } else res.redirect('/');
}

exports.getExpensesSum = function (req, res) {
    if (req.user) {
        if (req.body.time == 'month') {
            let date = new Date();
            let month = date.getMonth();
            let year = date.getFullYear();
            let endDay;
            switch (month) {
                case '0':
                case '2':
                case '4':
                case '6':
                case '7':
                case '9':
                case '11':
                    endDay = 31;
                    break;
                case '1':
                    endDay = 28;
                default:
                    endDay = 30;
            }
            let startDate = new Date(year, month, 1);
            let endDate = new Date(year, month, endDay);
            Expense.findAll({
                where: {user: req.user.username, date: {[Op.between]: [startDate, endDate]}},
                attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'amount']]
            })
                .then(expense => {
                    res.send(JSON.stringify(expense))
                })
                .catch((err) => console.log('Error: ' + err.message));
        } else {
            Expense.findAll({
                where: {user: req.user.username},
                attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'amount']]
            })
                .then(expense => {
                    res.send(JSON.stringify(expense))
                })
                .catch((err) => console.log('Error: ' + err.message));
        }
    } else res.redirect('/');
}
