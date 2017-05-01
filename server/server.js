require('./../config/config');

const fs = require('fs');

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

const logsDir = "logs/"

// Configure

var app = express();
app.use(bodyParser.json());

/*var now = new Date().toString();
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
fs.appendFile(`${logsDir}server.log`,  `\n----------- LOG STARTED at ${now} -----------\n\n`, (error) => { if (error) console.log('Cant write to logs') });

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `[${now}] ${req.method} ${req.url} ${JSON.stringify(req.params)}`
    console.log(log);
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
    fs.appendFile(`${logsDir}server.log`, log + '\n', (error) => { if (error) console.log('Cant write to logs') });
    next();
});*/

// Routes

app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => res.send({ todos }), (e) => res.status(400).send(e));
});

app.post('/todos', (req, res) => {
    var todo = new Todo({ text: req.body.text });
    todo.save()
        .then((doc) => res.status(201).send(doc), (e) => res.status(400).send(e));
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.sendStatus(404);
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.sendStatus(404);
        }
        res.send({ todo });
    }).catch((e) => res.sendStatus(400));
    
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) return res.sendStatus(404);
    
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) return res.sendStatus(404);
        res.send({ todo });
    }).catch((e) => res.sendStatus(404));
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    
    if (!ObjectID.isValid(id)) return res.sendStatus(404);
    
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if(!todo) return res.sendStatus(404);
            res.send({todo});
        }).catch((e) => res.sendStatus(400));
});

// auth 

app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => res.status(400).send(e));
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => res.header('x-auth', token).send(user));
    }).catch((e) => {
        res.sendStatus(400);
    });
});

app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
});

// Listening...

const port = process.env.PORT || 3000;
const ip = process.env.IP || "0.0.0.0";
app.listen(port, ip, () => {
    console.log(`Started at ${ip}:${port}`);
});

module.exports = { app };
