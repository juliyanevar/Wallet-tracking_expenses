const express = require("express");
const homeController = require("../controllers/homeController");
const homeRouter = express.Router();

homeRouter.get("/", homeController.index);
homeRouter.get("/login", homeController.login);
homeRouter.get("/home", homeController.home);
homeRouter.get('/viewExpense', homeController.viewExpense);
homeRouter.get('/logout', homeController.logout);


module.exports = homeRouter;
