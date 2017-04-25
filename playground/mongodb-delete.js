const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    var c = db.collection('Todos');
    
    // delete many
    
    // c.deleteMany({text: 'Something to do'}).then((result) => {
    //     console.log(result);
    // });
    
    // delete one
    
    // c.deleteOne({text: 'Something to do'}).then((result) => console.log(result));
    
    // find one and delete
    
    c.findOneAndDelete({completed: false}).then((result) => console.log(result));
    
    // db.close();
});