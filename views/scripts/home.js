const base_api_path = `${window.location.origin}/`;

window.onload = () => {
    getHomePage();
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
    //if (document.getElementsByName('date')[0].value <= new Date()) {
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
            drawChart();
            cleanFields();
        })
    // } else {
    //     document.getElementById('dateMessage')[0].value = 'Incorrect date!';
    // }
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
        drawChart();
        cleanFields();
    })
}


async function drawChart(radioValue='allTime') {
    var result = [];
    var resultSum = [];
    await fetch(base_api_path + 'expense/usersExpensesSum', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
            {
                time:radioValue
            }
        )
    })
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                result.push([exp.category, exp.amount]);
            })
        });

    await fetch(base_api_path + 'expense/ExpensesSum', {method: 'GET'})
        .then(res => res.json())
        .then(res => {
            res.forEach(exp => {
                resultSum.push(['Expense', exp.amount]);
            })
        });
    await fetch(base_api_path + 'income/IncomesSum', {method: 'GET'})
        .then(res => res.json())
        .then(res => {
            res.forEach(inc => {
                resultSum.push(['Income', inc.amount]);
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
        title: 'My Expenses'
    };

    var optionsSum = {
        title: 'Balance'
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


function logout() {
    fetch(base_api_path + 'logout', {method: 'GET'})
    // .then(response => response.text())
    // .then(view => {
    //     document.getElementById('content').innerHTML = view;
    // });
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
                '      <th scope="col">Amount</th>\n' +
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
        });
        getExpensesIncomes('expense');
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
        });
        getExpensesIncomes('income');
    }
}
