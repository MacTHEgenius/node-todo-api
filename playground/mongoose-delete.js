const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

// Todo.remove({}).then((res) => console.log(res));

// Todo.findOneAndRemove()

// Todo.findByIdAndRemove(:id)

Todo.findOneAndRemove({ _id: "5900fe64906f2166f79712e2" }).then((todo) => console.log(JSON.stringify(todo, undefined, 2)));

Todo.findByIdAndRemove("5900fe64906f2166f79712e2").then((todo) => console.log(JSON.stringify(todo, undefined, 2)));