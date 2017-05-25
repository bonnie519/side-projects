//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');
// var user = {name: 'bonnie', age:25};
// var {name} = user;//destructuring

//mongodb://localhost:27017/TodoApp
//mongodb://<dbuser>:<dbpassword>@ds147551.mlab.com:47551/todoapp
MongoClient.connect('mongodb://bonnie:zxcvbfds@ds147551.mlab.com:47551/todoapp',(err, db)=>{
  //no need to create 'TodoApp'
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // },(err, result) =>{
  //   if(err){
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });

  //Insert new doc into Users {name, age, location}
  // db.collection('Users').insertOne({
  //   name: 'Bonne',
  //   age: 25,
  //   location: 'Changzhou'
  // },(err, result) =>{
  //   if(err){
  //     return console.log('Unable to insert user', err);
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  //   //console.log(JSON.stringify(result.ops[0]._id,undefined,2));
  // });

  db.close();
});
