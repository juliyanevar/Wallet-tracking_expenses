const Sequelize = require('sequelize');
const sequelize = new Sequelize('TrackingExpenses', 'sa', '123456', {host: 'DESKTOP-QCIHU10', dialect: 'mssql'});

module.exports=sequelize;