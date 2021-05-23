const base_api_path = `${window.location.origin}/`;

window.onload = () => {
    getHomePage();
}
const socketIo = io();

// socketIo.on('getChart', _ => {
//     setTimeout(_ => drawChart(), 500);
// })
//
// socketIo.on('getExp', _ => {
//     setTimeout(_ => getExpensesIncomes('expense'), 500);
// })
//
// socketIo.on('getInc', _ => {
//     setTimeout(_ => getExpensesIncomes('income'), 500);
// })
//
// socketIo.on('getReport', _ => {
//     setTimeout(_ => updateReport(), 500);
// })

socketIo.on('getAll', _ => {
    setTimeout(_ => getAll(), 500);
})

function getAll() {
    drawChart()
    getExpensesIncomes('expense')
    getExpensesIncomes('income')
    report();
    drawBarChart();
}


async function getHomePage() {
    fetch(base_api_path + 'home', {method: 'GET'})
        .then(response => response.text())
        .then(view => {
            document.getElementById('content').innerHTML = view;
        }).then(_ => {
        getCategoryExpenses();
        getCategoryIncomes();
    });
    google.charts.load('current', {'packages': ['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}

async function getCategoryExpenses() {
    var dvContainer = document.getElementById("dvContainer");
    await fetch(base_api_path + 'expenseCategory/', {method: 'GET'})
        .then(res => res.json())
        .then(res => {
            res.forEach(category => {
                var option = document.createElement("OPTION");
                option.innerHTML = category.name;
                option.value = category.name;
                dvContainer.options.add(option);
            })
        }).then(_ => {
            cleanFields();
        });
}

async function getCategoryIncomes() {
    var dvContainer = document.getElementById("dvContainer1");
    await fetch(base_api_path + 'incomeCategory/', {method: 'GET'})
        .then(res => res.json())
        .then(res => {
            res.forEach(category => {
                var option = document.createElement("OPTION");
                option.innerHTML = category.name;
                option.value = category.name;
                dvContainer.options.add(option);
            })
        }).then(_ => {
            cleanFields();
        });
}

async function addExpense() {
    let balance = 0;
    await fetch(base_api_path + 'expense/create',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    amount: document.getElementsByName('amount')[0].value,
                    date: document.getElementsByName('date')[0].value,
                    category: document.getElementsByName('category')[0].value,
                    description: document.getElementsByName('description')[0].value
                }
            )
        }).then(_ => {
            setTimeout(_=>drawChart(),500);
        cleanFields();
        socketIo.emit('update', 'getAll');
    })
    await fetch(base_api_path + 'expense/ExpensesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'allTime'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                balance -= parseFloat(exp.amount);
            })
        });
    await fetch(base_api_path + 'income/IncomesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'allTime'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(inc => {
                balance += parseFloat(inc.amount);
            })
        });
    if (balance < 0) {
        let myModal = new bootstrap.Modal(document.getElementById('modal'));

        myModal.show();
    }
}

async function addIncome() {
    await fetch(base_api_path + 'income/create',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    amount: document.getElementsByName('amount1')[0].value,
                    date: document.getElementsByName('date1')[0].value,
                    category: document.getElementsByName('category1')[0].value,
                    description: document.getElementsByName('description1')[0].value
                }
            )
        }).then(_ => {
        setTimeout(_=>drawChart(),500);
        socketIo.emit('update', 'getAll');
        cleanFields();
    })
}


async function drawChart(radioValue = 'month') {
    var result = [];
    var resultSum = [];
    await fetch(base_api_path + 'expense/usersExpensesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: radioValue
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                result.push([exp.category, +exp.amount]);
            })
        });

    await fetch(base_api_path + 'expense/ExpensesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: radioValue
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                resultSum.push(['Expense', +exp.amount]);
            })
        });
    await fetch(base_api_path + 'income/IncomesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: radioValue
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(inc => {
                resultSum.push(['Income', +inc.amount]);
            })
        });

    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    data.addRows(result);

    var dataSum = new google.visualization.DataTable();
    dataSum.addColumn('string', 'Type');
    dataSum.addColumn('number', 'Amount');
    dataSum.addRows(resultSum);

    var options = {
        title: 'My Expenses',
        titleTextStyle: {fontSize: 20},
        //is3D: true,
        pieHole: 0.3,
        colors: ['#fcf170', '#fad836', '#f58553', '#f16043', '#c1559b', '#e57cb6', '#957fbb', '#4357a4', '#6ca3d8', '#57caf4', '#27ad7d', '#70c27e', '#e9eea5', '#c5d92f', '#d2d0cf']
    };

    var optionsSum = {
        title: 'Balance',
        titleTextStyle: {fontSize: 20},
        //is3D: true,
        pieHole: 0.3,
        colors: ['#4357a4', '#957fbb']
    }

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    var chartSum = new google.visualization.PieChart(document.getElementById('piechart1'));

    chart.draw(data, options);
    chartSum.draw(dataSum, optionsSum);
}

function cleanFields() {
    document.getElementsByName('amount')[0].value =
        document.getElementsByName('date')[0].value =
            document.getElementsByName('description')[0].value =
                document.getElementsByName('category')[0].value =
                    document.getElementsByName('amount1')[0].value =
                        document.getElementsByName('date1')[0].value =
                            document.getElementsByName('description1')[0].value =
                                document.getElementsByName('category1')[0].value = '';

}


async function getViewExpense() {
    await fetch(base_api_path + 'viewExpense', {method: 'GET'})
        .then(response => response.text())
        .then(view => {
            document.getElementById('content').innerHTML = view;
            getExpensesIncomes('expense');
            getExpensesIncomes('income');
        });
}

async function getReport() {
    await fetch(base_api_path + 'summaryReport', {method: 'GET'})
        .then(response => response.text())
        .then(view => {
            document.getElementById('content').innerHTML = view;
            report();
            drawBarChart();
        });
}

function logout() {
    fetch(base_api_path + 'logout', {method: 'GET'});
    fetch(base_api_path, {method: 'GET'})
        .then(response => response.text())
        .then(view => document.body.innerHTML = view)
        .then(
            fetch(base_api_path + 'login', {method: 'GET'})
                .then(response => response.text())
                .then(view => {
                    document.getElementById('content').innerHTML = view;
                })
        );
}


async function getExpensesIncomes(type) {
    let path;
    let deleteB;
    let tableId;
    switch (type) {
        case 'expense':
            path = 'expense/getUsersExpenses';
            tableId = 'tableExpense';
            deleteB = 'deleteExpense(event)';
            break;
        case 'income':
            path = 'income/getUsersIncomes';
            tableId = 'tableIncome';
            deleteB = 'deleteIncome(event)';
            break;
    }
    await fetch(base_api_path + path, {method: 'GET'})
        .then(res => res.json())
        .then(res => {
            let container = document.getElementById(tableId);
            container.innerHTML = '';
            container.innerHTML = '<tr>\n' +
                '      <th scope="col">Amount, $</th>\n' +
                '      <th scope="col">Date</th>\n' +
                '      <th scope="col">Category</th>\n' +
                '      <th scope="col">Description</th>\n' +
                '      <th scope="col">&nbsp;</th>\n' +
                '    </tr>'
            res.forEach(income => {
                let inc = document.createElement('tr');
                let td = document.createElement('td');
                let deleteButton = document.createElement('button');
                deleteButton.setAttribute('onclick', deleteB);
                deleteButton.setAttribute('ID', income.id);
                deleteButton.setAttribute('class', 'btn btn-outline-secondary');
                deleteButton.innerText = 'Delete';
                inc.innerHTML = `<td>${income.amount}</td><td>${income.date}</td><td>${income.category}</td><td>${income.description}</td>`;
                td.appendChild(deleteButton);
                inc.appendChild(td);
                container.appendChild(inc);
            })
        })
}


function deleteExpense(event) {
    if (confirm('Are you sure you want to remove this record?')) {
        fetch(base_api_path + 'expense/deleteExpense', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    id: event.target.getAttribute('id')
                })
        }).then(_ => {
            socketIo.emit('update', 'getAll');
            getExpensesIncomes('expense');
        });
    }
}

function deleteIncome(event) {
    if (confirm('Are you sure you want to remove this record?')) {
        fetch(base_api_path + 'income/deleteIncome', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    id: event.target.getAttribute('id')
                })
        }).then(_ => {
            socketIo.emit('update', 'getAll');
            getExpensesIncomes('income');
        });
    }
}

async function report() {
    let balance = 0;
    let totalExpense = 0;
    let totalIncome = 0;
    let monthExpense = 0;
    let monthIncome = 0;
    await fetch(base_api_path + 'expense/ExpensesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'allTime'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                balance -= exp.amount;
                totalExpense += parseFloat(exp.amount);
            })
        });
    await fetch(base_api_path + 'income/IncomesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'allTime'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(inc => {
                balance += parseFloat(inc.amount);
                totalIncome += parseFloat(inc.amount);
            })
        });
    await fetch(base_api_path + 'expense/ExpensesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'month'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                monthExpense += parseFloat(exp.amount);
            })
        });
    await fetch(base_api_path + 'income/IncomesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'month'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(inc => {
                monthIncome += parseFloat(inc.amount);
            })
        });

    document.getElementById('currentBalance').innerText = balance + '$';
    document.getElementById('totalExpense').innerText = totalExpense + '$';
    document.getElementById('totalIncome').innerText = totalIncome + '$';
    document.getElementById('monthlyExpense').innerText = monthExpense + '$';
    document.getElementById('monthlyIncome').innerText = monthIncome + '$';
}


async function drawBarChart() {
    let result = [];
    let resultIncomes = [];
    let monthExpense = [];
    let monthIncome = [];
    await fetch(base_api_path + 'expense/usersExpensesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'allTime'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                result.push([exp.category, +exp.amount]);
            })
        });

    await fetch(base_api_path + 'income/usersIncomesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'allTime'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                resultIncomes.push([exp.category, +exp.amount]);
            })
        });

    await fetch(base_api_path + 'expense/usersExpensesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'month'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                monthExpense.push([exp.category, +exp.amount]);
            })
        });

    await fetch(base_api_path + 'income/usersIncomesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time: 'month'
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                monthIncome.push([exp.category, +exp.amount]);
            })
        });

    let data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    data.addRows(result);

    let dataIncomes = new google.visualization.DataTable();
    dataIncomes.addColumn('string', 'Category');
    dataIncomes.addColumn('number', 'Amount');
    dataIncomes.addRows(resultIncomes);

    let dataMonthExp = new google.visualization.DataTable();
    dataMonthExp.addColumn('string', 'Category');
    dataMonthExp.addColumn('number', 'Amount');
    dataMonthExp.addRows(monthExpense);

    let dataMonthInc = new google.visualization.DataTable();
    dataMonthInc.addColumn('string', 'Category');
    dataMonthInc.addColumn('number', 'Amount');
    dataMonthInc.addRows(monthIncome);

    let options = {
        title: 'Total Expense',
        colors: ['#f16043']
    };

    let optionsIncomes = {
        title: 'Total Income',
        colors: ['#27ad7d']
    };

    let optionsMonthExp = {
        title: 'Monthly Expense',
        colors: ['#f16043']
    };

    let optionsMonthInc = {
        title: 'Monthly Income',
        colors: ['#27ad7d']
    };

    let chart = new google.visualization.ColumnChart(document.getElementById('divTotalExpense'));
    let chartIncomes = new google.visualization.BarChart(document.getElementById('divTotalIncome'));
    let chartMonthExp = new google.visualization.ColumnChart(document.getElementById('divMonthlyExpense'));
    let chartMonthInc = new google.visualization.BarChart(document.getElementById('divMonthlyIncome'));

    chart.draw(data, options);
    chartIncomes.draw(dataIncomes, optionsIncomes);
    chartMonthExp.draw(dataMonthExp, optionsMonthExp);
    chartMonthInc.draw(dataMonthInc, optionsMonthInc);
}
