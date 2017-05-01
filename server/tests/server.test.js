const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    
    it('should create a new todo', (done) => {
        var text = 'Test todo text';
        
        request(app)
            .post('/todos')
            .send({ text })
            .expect(201)
            .expect((res) => expect(res.body.text).toBe(text))
            .end((error, res) => {
                if (error) {
                    return done(error);
                }
                
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });
    
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((error, res) => {
                if (error) {
                    return done(error);
                }
                
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(todos.length);
                    done();
                }).catch((e) => done(e));
            });
    });
    
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => expect(res.body.todos.length).toBe(todos.length))
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    
    it('should return todo by its id with valid id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => expect(res.body.todo.text).toBe(todos[0].text))
            .end(done);
    });
    
    it('should return 404 with todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    
    it('should return 404 with invalid id', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
    
});

describe('DELETE /todos/:id', () => {
    
    it('should delete todo by its id with valid id', (done) => {
        var todo = todos[0];
        var hexId = todo._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => expect(res.body.todo._id).toBe(hexId))
            .end((err, res) => {
                if (err) return done(err);
                
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });
    
    it('should return 404 with todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    
    it('should return 404 with invalid id', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
    
});

describe('PATCH PUT /todos/:id', () => {
    
    it('should update todo with valid id and completed true', (done) => {
        var newText = "Slide that stairs to shoot those hoorooks in the head.";
        var todo = todos[1];
        var hexId = todo._id.toHexString();
        
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text: newText, completed: true })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            }).end((err, res) => {
                if (err) return done(err);
                Todo.findById(hexId).then((todo) => {
                    expect(todo.text).toBe(newText);
                    expect(todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA('number');
                    done();
                }).catch((e) => done(e));
            });
    });
    
    it('should update todo with valid id and completed false', (done) => {
        var todo = todos[3];
        var hexId = todo._id.toHexString();
        
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            }).end((err, res) => {
                if (err) return done(err);
                Todo.findById(hexId).then((todo) => {
                    expect(todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });
    
    it('should return 404 with todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        var newText = "Slide that stairs to shoot those hoorooks in the head.";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text: newText, completed: true })
            .expect(404)
            .end(done);
    });
    
    it('should return 404 with invalid id', (done) => {
        var newText = "Slide that stairs to shoot those hoorooks in the head.";
        request(app)
            .delete('/todos/123')
            .send({ text: newText, completed: true })
            .expect(404)
            .end(done);
    });
    
});

describe('POST /users', () => {
    
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = '123abc!';
        
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) return done(err);
                
                User.findOne({ email }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e));
            });
    });
    
    it('should return validation errors if request invalid', (done) => {
        var email = 'emailexample.com';
        var password = 'hello';
        
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
    
    it('should not create user if email in use', (done) => {
        request(app)
            .post('/users')
            .send({ email: users[0].email, password: 'abc123!' })
            .expect(400)
            .end(done);
    });
    
});

describe('POST /users/login', () => {
    
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: users[1].password })
            .expect(200)
            .expect((res) => expect(res.headers['x-auth']).toExist())
            .end((err, res) => {
                if (err) return done(err);
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            });
    });
    
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({ email: users[1].email, password: 'password' })
            .expect(400)
            .expect((res) => expect(res.headers['x-auth']).toNotExist())
            .end((err, res) => {
                if (err) return done(err);
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
    
});

describe('GET /users/me', () => {
    
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done);
    });
    
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => expect(res.body).toEqual({}))
            .end(done);
    });
    
});