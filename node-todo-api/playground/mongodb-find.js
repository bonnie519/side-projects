//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');
// var user = {name: 'bonnie', age:25};
// var {name} = user;//destructuring



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
  //no need to create 'TodoApp'
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({
  //   _id:new ObjectId('591da917758e8adfcf709327')
  // }).toArray().then((docs)=>{
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs,undefined,2));
  // },(err)=>{
  //   console.log('Unable to fetch todos', err);
  // });

  db.collection('Users').find({name: 'Bonne'}).toArray().then((docs)=>{
    console.log('Users:');//' count: ${count}`);
    console.log(JSON.stringify(docs,undefined,2));
  },(err)=>{
    console.log('Unable to fetch users', err);
  });

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
