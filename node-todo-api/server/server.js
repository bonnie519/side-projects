require('./config/config');
const http = require('http');
const path = require('path');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
const express = require('express');
const hbs = require('hbs');//handle bars
const bodyParser = require('body-parser');
var favicons = require('connect-favicons');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

const publicPath = path.join(__dirname, '../public');
var app = express();
app.use(favicons(publicPath));
app.use(express.static(publicPath));
//app.set('view engine', 'hbs');//key-value set
const port = process.env.PORT;

app.use(bodyParser.json());


app.post('/todos',authenticate, (req,res)=>{
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then((doc)=>{
      res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos',authenticate,(req,res)=>{
  Todo.find({_creator:req.user._id}).then((todos)=>{
      res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  })
});
//GET /todos/123424
app.get('/todos/:id', authenticate, (req, res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){  //valid id using isValid
    return res.status(404).send({err:'invalid id'});
  }//send 404 empty back

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo)=>{
      if(!todo){
        return res.status(404).send({err: 'todo not found'});
      }
      res.send({todo});
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

app.delete('/todos/:id',authenticate, (req, res)=>{
  //get the id
  var id = req.params.id;
  if(!ObjectID.isValid(id)){  //valid id using isValid
    return res.status(404).send();
  }
  //validate id

  //remove todo by id
  Todo.findOneAndRemove({
    _id:id,
    _creator: req.user._id
  }).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res)=>{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)){  //valid id using isValid
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id:id,
    _creator:req.user._id
  },{$set: body},{new: true}).then((todo)=>{
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e)=>{
    res.status(400).send();
  });
});

//POST /users
app.post('/users',(req, res)=>{
  var body = _.pick(req.body,['email','password']);
  var user = new User(body);

  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OTIwNWM2NGJhOWVkZTIxOTgwOWI1ODAiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNDk1MjkzMDI4fQ.v-bHHcHyAPkiYa3jQ81jRgq_4P2NZUsqNd8KjE2R_24
//authenticate
app.get('/users/me',authenticate, (req, res)=>{

  res.send(req.user);
});

app.post('/users/login',(req, res)=>{
    var body = _.pick(req.body,['email','password']);
    User.findByCredentials(body.email,body.password).then((user)=>{
      //create a token
      return user.generateAuthToken().then((token)=>{
        res.header('x-auth',token).send(user);
      });
    }).catch((e)=>{
      res.status(400).send();
    });
});

app.delete('/users/me/token',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  },()=>{
    res.status(400).send();
  })
});
http.createServer(app).listen(port,()=>{
  console.log('Started on port', port);
});

module.exports = {app};
// var newTodo = new Todo({
//   text: 'Cook dinner'
// });
//
// newTodo.save().then((doc)=>{
//   console.log('Saved todo',doc);
// },(e)=>{
//   console.log('Unable to save todo');
// });
//
// var newTodo = new Todo({
//   text: '  Edit this video '
// });

// newTodo.save().then((doc)=>{
//   console.log(JSON.stringify(doc,undefined,2));
// },(e)=>{
//   console.log('Unable to save', e);
// });
//save new sth
//User email
// var newUser = new User({
//   email: '  beigao519@gmail.com '
// });
//
// newUser.save().then((doc)=>{
//   console.log('User saved', doc);
// },(e)=>{
//   console.log('Unable to save', e);
// });
