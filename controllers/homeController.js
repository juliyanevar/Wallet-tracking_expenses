const fs = require('fs');

exports.index = function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.end(fs.readFileSync('./index.html'));
};

exports.login = async function (req, res) {
    let view = fs.readFileSync('./views/start.html',"utf8");
    res.send(view);
};

exports.home = async function (req, res) {
    let view = fs.readFileSync('./views/home.html',"utf8");
    res.send(view);
};

exports.viewExpense = async function(req,res){
    let view = fs.readFileSync('./views/viewExpense.html',"utf8");
    res.send(view);
};

exports.logout = function(req,res){
    req.session.logout = true;
    req.session.destroy(e => {
        req.logout();
        res.redirect("/");
    });
}
