const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    var c = db.collection('Todos');
    
    //c.findOneAndUpdate({ _id: new ObjectID("58ffa3939d7d96d9e5911b86") }, { $set: { completed: true } }, { returnOriginal: false }).then((result) => console.log(result));
    
    c.findOneAndUpdate({ _id: new ObjectID("58ffa3939d7d96d9e5911b86") }, { $inc: { number: 1 } }, { returnOriginal: false }).then((result) => console.log(result));
    
    // db.close();
});