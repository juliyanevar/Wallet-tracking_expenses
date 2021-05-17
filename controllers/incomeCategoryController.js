const sequelize = require("../connection/db_connection.js");
const {User, Expense, Income, ExpenseCategory, IncomeCategory}=require('../models/db_schema.js').ORM(sequelize);

exports.getIncomeeCategories=function (req, res){
    IncomeCategory.findAll().then(expense=>res.send(JSON.stringify(expense)))
        .catch((err)=>console.log('Error: '+ err.message));
}
