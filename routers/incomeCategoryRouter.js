const express = require("express");
const incomeCategoryController = require('../controllers/incomeCategoryController');
const incomeCategoryRouter = express.Router();

incomeCategoryRouter.get('/' ,incomeCategoryController.getIncomeeCategories);

module.exports = incomeCategoryRouter;
