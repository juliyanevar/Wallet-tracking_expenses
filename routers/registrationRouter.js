const express = require("express");
const registrationController = require('../controllers/registrationController.js');
const registrationRouter = express.Router();


registrationRouter.get('/', registrationController.getPage)
registrationRouter.post('/', registrationController.sendCode);
registrationRouter.post('/addUser',registrationController.addUser);

module.exports = registrationRouter;