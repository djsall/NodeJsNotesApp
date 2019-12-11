const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

const fileLocation = __dirname + '/public/';

const con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test'
});

app.use(bodyParser.json());
app.use(express.static(fileLocation));

app.get('/', (req, res) => {
	res.sendFile(fileLocation + 'index.html');
});

app.get('/getlist', (req, res) => {
	queryMsg('select * from shopping where ip="' + req.ip + '"').then(
		doneResult => {
			res.send(JSON.stringify(doneResult));
		}
	);
});

app.get('/clearlist', (req, res) => {
	command('delete from shopping where ip="' + req.ip + '"');
	res.sendStatus(200);
});

app.post('/postItem', (req, res) => {
	con.query('insert into shopping (ip, message) values ("' + req.ip + '", "' + con.escape(req.body.message).replace("'", "") + '")', err => {
		if (err) throw err;
	});
	res.sendStatus(200);
});

function command(query) {
	con.query(query, err => {
		if (err) throw err;
	});
}

function queryMsg(query) {
	return new Promise((resolve, reject) => {
		let doneResult = [];
		con.query(query, (err, result) => {
			if (err) reject(err);
			result.forEach(item => {
				let curr = item['message'];
				doneResult.push(curr);
			});
			resolve(doneResult);
		});
	});
}
app.listen(3000, 'localhost');
