const express = require("express");
const incomeController = require('../controllers/incomeController');
const incomeRouter = express.Router();

incomeRouter.post('/create' ,incomeController.addIncome);
incomeRouter.get('/usersIncomesSum', incomeController.getUsersIncomesSum);
incomeRouter.get('/IncomesSum', incomeController.getIncomesSum);
incomeRouter.get('/getUsersIncomes', incomeController.getUsersIncomes);
incomeRouter.delete('/deleteIncome', incomeController.deleteIncome);

module.exports = incomeRouter;
