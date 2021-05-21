const express = require("express");
const incomeController = require('../controllers/incomeController');
const incomeRouter = express.Router();

incomeRouter.post('/create' ,incomeController.addIncome);
incomeRouter.post('/usersIncomesSum', incomeController.getUsersIncomesSum);
incomeRouter.post('/IncomesSum', incomeController.getIncomesSum);
incomeRouter.get('/getUsersIncomes', incomeController.getUsersIncomes);
incomeRouter.delete('/deleteIncome', incomeController.deleteIncome);

module.exports = incomeRouter;
