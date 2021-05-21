create database TrackingExpenses;
drop database TrackingExpenses;
use master;
use TrackingExpenses;

create table [User]
(
	username nvarchar(160) primary key,
	googleId nvarchar(400) unique not null
);

create table Expense
(
	id int primary key,
	[user] nvarchar(160) foreign key references [User](username),
	amount decimal(16,2) not null,
	[date] date not null,
	category nvarchar(100) foreign key references ExpenseCategory([name]),
	[description] nvarchar(1234)
);

create table Income
(
	id int primary key,
	[user] nvarchar(160) foreign key references [User](username),
	amount decimal(16,2) not null,
	[date] date not null,
	category nvarchar(100) foreign key references IncomeCategory([name]),
	[description] nvarchar(1234)
);

create table ExpenseCategory
(
	[name] nvarchar(100) primary key
);

create table IncomeCategory
(
	[name] nvarchar(100) primary key
);





insert into ExpenseCategory([name]) values('Bills'), ('Car'),
										  ('Clothes'), ('Communications'),
										  ('Eating out'), ('Entertainment'),
										  ('Food'), ('Gifts'),
										  ('Health'), ('House'),
										  ('Pets'), ('Sports'),
										  ('Taxi'), ('Toiletry'),
										  ('Transport');



insert into IncomeCategory([name]) values('Deposits'), ('Salary'),
										 ('Savings');

insert into [user] values('juli', 'juliyanevar@gmail.com');

select * from [income];

 SELECT [category], sum([amount]) FROM [Expense] AS [Expense] WHERE [Expense].[user] = N'juli' GROUP BY [category];


