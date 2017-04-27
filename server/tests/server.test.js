const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
    { _id: new ObjectID(), text: 'Beat Gimli record.' },
    { _id: new ObjectID(), text: 'Kill some orcs.' },
    { _id: new ObjectID(), text: 'Be the greatest archer.' },
    { _id: new ObjectID(), text: 'Be a badass elf.', completed: true, completedAt: 123 }
];

beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        })
        .then(() => done());
});

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
                    expect(todo).toNotExist()
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
                // expect(res.body.todo.completedAt).toBeA('number');
            }).end((err, res) => {
                if (err) return done(err);
                Todo.findById(hexId).then((todo) => {
                    expect(todo.completed).toBe(false);
                    // expect(res.body.todo.completedAt).toBeA('number');
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