var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'Himanshu@123',
	database : 'nodelogin'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var cond=0;

app.get('/', function(request, response) {
    if(cond == 0 ){
        response.sendFile(path.join(__dirname + '/login.html'));
        cond=1;
    }
    else{
        response.sendFile(path.join(__dirname + '/signup.html'));
        cond=2;
    }
});

app.post('/auth', function(request, response) {
        var username = request.body.username;
	    var password = request.body.password;
	    if (username && password) {
		    connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			    if (results.length > 0) {
				    request.session.loggedin = true;
				    request.session.username = username;
				    response.redirect('/home');
                }
                 else {
				    response.redirect('/');
			    }			
		    	response.end();
		});
	    } else {
		    response.send('Please enter Username and Password!');
		    response.end();
	    }
});

app.get('/auth', function(request, response){
    var username = request.query.username;
    var password = request.query.password;
    var email = request.query.email;
    console.log(username+" "+password+" "+email);
    if (username && password && email) {
	    connection.query('INSERT INTO accounts(username,password,email) VALUES(?,?,?)', [username, password, email], function (err, result) {
        if (err) throw err;
            console.log("1 record inserted");
        });
        response.end();
    } else {
	    response.send('Please enter Username and Password!');
	    response.end();
    }
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
    }
	response.end();
});


app.listen(3001);