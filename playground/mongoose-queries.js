const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

var id = '5900de172f5977c913b1f8b6';

if (!ObjectID.isValid(id)) {
    console.log('Id not valid');
}

// Todo.find({ _id: id })
//     .then((todos) => {
//         console.log('Todos', todos);
//     });
    
// Todo.findOne({ _id: id })
//     .then((todo) => {
//         console.log('Todo', todo);
//     });
    
Todo.findById(id)
    .then((todo) => {
        if(!todo) {
            return console.log('Id not found');
        }
        console.log('Todo by id', todo);
    }).catch((e) => console.log(e));