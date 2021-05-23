const express = require("express");
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session')({resave: false, saveUninitialized: false, secret: '321',});
const Sequelize = require('sequelize');
const sequelize = require("./connection/db_connection.js");
const {User, Expense, Income, ExpenseCategory, IncomeCategory}=require('./models/db_schema.js').ORM(sequelize);
const Op = Sequelize.Op;
const PORT = process.env.PORT || 3000;

const registrationRouter = require("./routers/registrationRouter.js");
const expenseCategoryRouter = require('./routers/expenseCategoryRouter');
const expenseRouter = require('./routers/expenseRouter');
const homeRouter = require('./routers/homeRouter');
const incomeCategoryRouter = require('./routers/incomeCategoryRouter');
const incomeRouter = require('./routers/incomeRouter');

require('./config/passport');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + '/views'));

sequelize.authenticate()
    .then(() => {
        console.log('Соединение с базой данных установлено');

    })
    .catch(err => {
        console.log('Ошибка при соединении с базой данных', err.message);
    });

app.use('/', homeRouter);
app.use('/registration', registrationRouter);
app.use('/expenseCategory', expenseCategoryRouter);
app.use('/expense', expenseRouter);
app.use('/incomeCategory', incomeCategoryRouter);
app.use('/income', incomeRouter);

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));

app.get(
     "/auth/google/callback",
     passport.authenticate("google", { failureRedirect: "/" }),
     function (req, res) {
         res.redirect("/resource");
     }
 );

app.get('/resource', (req, res, next)=>{
    if(req.user) {
        JSON.parse(JSON.stringify(req.user.emails), (key, value) => {
            if(key === 'value'){
                User.findOne({where:{googleId:value}}).then((user)=>{
                        if (user){
                            req.user.username=user.username;
                            res.sendFile(__dirname+'/indexHome.html');
                        }
                        else res.redirect('/')})
                    .catch(err=>{console.log(err.message)});
            }
        });
    }
    else res.redirect('/');
});


app.use(function (req, res, next) {
    res.status(404).send("Not Found")
});

app.listen(PORT,()=>{console.log('Listening on http://localhost:3000/');});
