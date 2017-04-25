const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    
    // db.collection('Todos').find({ _id: new ObjectID("58ff8822e5888b1b63678fcd") }).toArray().then((docs) => { 
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (error) => {
    //     console.log('Unable to insert todo', error);
    // });

    db.collection('Todos').find().count().then((count) => { 
        console.log(`Todos count: ${count}`);
    }, (error) => {
        console.log('Unable to insert todo', error);
    });
    
    // db.close();
});