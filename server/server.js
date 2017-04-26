var express = require('express');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

// Configure

var app = express();
app.use(bodyParser.json());

// Routes

app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => res.send({ todos }), (e) => res.status(400).send(e));
});

app.post('/todos', (req, res) => {
    var todo = new Todo({ text: req.body.text });
    todo.save()
        .then((doc) => res.send(doc), (e) => res.status(400).send(e));
});

// Listening...

const port = process.env.PORT || 3000;
const ip = process.env.IP || "0.0.0.0";
app.listen(port, ip, () => {
    console.log(`Started at ${ip}:${port}`)
});

module.exports = { app };
