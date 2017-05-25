const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

//find the first one that match and remove return the removed one
Todo.findOneAndRemove({_id:'591fbf43c8bcfd22a1331db0'}).then((todo)=>{
  console.log(todo);
});
// Todo.findByIdAndRemove('591fbf43c8bcfd22a1331db0').then((todo)=>{
//   console.log(todo);
// });
