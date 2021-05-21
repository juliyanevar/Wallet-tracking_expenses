const express = require("express");
const expenseController = require('../controllers/expenseController');
const expenseRouter = express.Router();

expenseRouter.post('/create' ,expenseController.addExpense);
expenseRouter.post('/usersExpensesSum', expenseController.getUsersExpensesSum);
expenseRouter.post('/ExpensesSum', expenseController.getExpensesSum);
expenseRouter.get('/getUsersExpenses', expenseController.getUsersExpenses);
expenseRouter.delete('/deleteExpense', expenseController.deleteExpense);

module.exports = expenseRouter;
