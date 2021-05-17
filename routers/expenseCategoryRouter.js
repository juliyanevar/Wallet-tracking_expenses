const express = require("express");
const expenseCategoryController = require('../controllers/expenseCategoryController');
const expenseCategoryRouter = express.Router();

expenseCategoryRouter.get('/' ,expenseCategoryController.getExpenseCategories);

module.exports = expenseCategoryRouter;