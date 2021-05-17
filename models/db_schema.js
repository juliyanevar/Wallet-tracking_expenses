const Sequelize = require('sequelize');
const Model = Sequelize.Model;


class User extends Model {
};

class Expense extends Model {
};

class Income extends Model {
};

class ExpenseCategory extends Model {
};

class IncomeCategory extends Model {
};

function internalORM(sequelize) {
    User.init(
        {
            username: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
            googleId: {type: Sequelize.STRING, allowNull: false}
        },
        {sequelize, modelName: 'User', tableName: 'User', timestamps: false}
    );
    ExpenseCategory.init(
        {
            name: {type: Sequelize.STRING, allowNull: false, primaryKey: true}
        },
        {sequelize, modelName: 'ExpenseCategory', tableName: 'ExpenseCategory', timestamps: false}
    );
    Expense.init(
        {
            id:{type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
            user:{type: Sequelize.INTEGER, allowNull: false,
                    references: {model: User, key: 'username'}},
            amount: {type: Sequelize.DECIMAL(16, 2) , allowNull: false},
            date: {type: Sequelize.DATEONLY, allowNull: false },
            category: {type: Sequelize.INTEGER, allowNull: false,
                        references: {model: ExpenseCategory, key: 'name'}
            },
            description: {type: Sequelize.STRING, allowNull: true, defaultValue:null}
        },
        {sequelize, modelName: 'Expense', tableName: 'Expense', timestamps: false}
    );
    IncomeCategory.init(
        {
            name: {type: Sequelize.STRING, allowNull: false, primaryKey: true}
        },
        {sequelize, modelName: 'IncomeCategory', tableName: 'IncomeCategory', timestamps: false}
    );
    Income.init(
        {
            id:{type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
            user:{type: Sequelize.INTEGER, allowNull: false,
                references: {model: User, key: 'username'}},
            amount: {type: Sequelize.DECIMAL(16, 2) , allowNull: false},
            date: {type: Sequelize.DATEONLY, allowNull: false },
            category: {type: Sequelize.INTEGER, allowNull: false,
                references: {model: IncomeCategory, key: 'name'}
            },
            description: {type: Sequelize.STRING, allowNull: true}
        },
        {sequelize, modelName: 'Income', tableName: 'Income', timestamps: false}
    );

    // Expense.belongsTo(ExpenseCategory);
    // Expense.belongsTo(User);
    // Income.belongsTo(IncomeCategory);
    // Income.belongsTo(User);
    // ExpenseCategory.hasMany(Expense);
    // IncomeCategory.hasMany(Income);
    // User.hasMany(Expense);
    // User.hasMany(Income);
};



exports.ORM = (s) => {
    internalORM(s);
    return {User, Expense, Income, ExpenseCategory, IncomeCategory};
}
