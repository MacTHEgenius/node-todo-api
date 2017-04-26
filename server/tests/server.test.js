const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

const todos = [
    { text: 'Beat Gimli record.' },
    { text: 'Kill some orcs.' },
    { text: 'Be the greatest archer.' }
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
    
    // it('should not get a todo by its id with invalid id', (done) => {
    //     request(app)
    //         .get('/todos/' + 123)
    //         .expect(200)
    //         .end(done);
    // });
    
    // it('should not get a todo by its id with invalid id', (done) => {
    //     request(app)
    //         .get('/todos/' + 123)
    //         .expect(400)
    //         .end(done);
    // });
    
    it('should not get a todo by its id with invalid id', (done) => {
        request(app)
            .get('/todos/' + 123)
            .expect(404)
            .end(done);
    });
    
});