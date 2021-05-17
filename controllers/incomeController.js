const sequelize = require("../connection/db_connection.js");
const Sequelize = require('sequelize');
const {User, Expense, Income, ExpenseCategory, IncomeCategory}=require('../models/db_schema.js').ORM(sequelize);


exports.getIncomes=function(req, res){
    Income.findAll().then(incomes=>res.send(JSON.stringify(incomes)))
        .catch((err)=>console.log('Error: '+ err.message));
};

exports.addIncome = function (req, res){
    Income.findAll({
        attributes: [Sequelize.fn('max', Sequelize.col('id'))],
        raw: true,
    })
        .then(maxId=>{
            JSON.parse(JSON.stringify(maxId),(key, value)=>{
                if(key === '') {
                    if (value == null) {
                        Income.create({
                            id: 1,
                            user: req.user.username,
                            amount: req.body.amount,
                            date: req.body.date,
                            category: req.body.category,
                            description: req.body.description
                        })
                            .catch((err) => console.log('Error: ' + err.message));
                        res.send();
                    } else if(!Array.isArray(value)){
                        let Id = value + 1;
                        Income.create({
                            id: Id,
                            user: req.user.username,
                            amount: req.body.amount,
                            date: req.body.date,
                            category: req.body.category,
                            description: req.body.description
                        })
                            .catch((err) => console.log('Error: ' + err.message));
                        res.send();
                    }
                }
            })});
};

exports.updateIncome=function (req, res){
    Income.update(
        {user: req.req.user.username, amount: req.body.amount, date: req.body.date, categoryId: req.body.categoryId, description: req.body.description},
        {where: {id: req.body.id}}
    ).catch((err)=>console.log('Error: '+ err.message));
};

exports.deleteIncome = function (req,res){
    Income.destroy({where:{id: req.body.id}})
        .catch((err)=>console.log('Error: '+ err.message));
}

exports.getUsersIncomes = function (req, res){
    Income.findAll({
        where:{user:req.user.username}})
        .then(expense=>res.send(JSON.stringify(expense)))
        .catch((err)=>console.log('Error: '+ err.message));
}

exports.getUsersIncomesSum = function (req, res){
    Income.findAll({
        where:{user:req.user.username},
        attributes: ['category',
            [Sequelize.fn('sum', Sequelize.col('amount')), 'amount']],
        group: ["category"]})
        .then(expense=>{res.send(JSON.stringify(expense))
        })
        .catch((err)=>console.log('Error: '+ err.message));
}

exports.getIncomesSum=function(req, res){
    Income.findAll({
        where:{user:req.user.username},
        attributes: [[Sequelize.fn('sum', Sequelize.col('amount')), 'amount']]})
        .then(expense=>{res.send(JSON.stringify(expense))
        })
        .catch((err)=>console.log('Error: '+ err.message));
}
