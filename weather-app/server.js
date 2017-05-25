const request = require('request');
const express = require('express');
const hbs = require('hbs');//handle bars
const fs = require('fs');
const weather = require('./app-promise');

const port = process.env.PORT || 3000;
var app = express();

var bodyParser = require('body-parser');
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');//key-value set

app.use(bodyParser.urlencoded({extended:false}));//use bodyparser to get parameters from POST
app.use((req, res, next)=>{
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log',log + '\n', (err)=>{
    if(err){
      console.log('Unable to append to server.log');
    }
  });
  next();
});


//heroku --help
//heroku login
//heroku keys:add
//heroku keys
///heroku keys:remove
//ssh -v git@heroku.com
//SET
// app.use((req, res, next)=>{
//   res.render('maintenance.hbs');
// });

app.use(express.static(__dirname + '/public'));//little middleware

hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt',(text)=>{
  return text.toUpperCase();
});

app.get('/',(req, res)=>{
  //res.send('<h1>Hello Express!</h1>');
  res.render('home.hbs',{
    pageTitle: 'Home Page',
    welcomeMsg: 'Welcome Home!',
  });
});

app.get('/about',(req,res)=>{
  res.render('about.hbs',{
    pageTitle: 'About Page',
  });
});

app.get('/projects',(req,res)=>{
  res.render('projects.hbs',{
    pageTitle: 'Projects'
  });
});
app.get('/bad',(req, res)=>{
  res.send({
    errorMessage:'Unable to handle request'
  });
});
app.post('/test', (req, res)=> {
    //console.log(req,undefined,2));
    //console.log(req.body.addr);
    weather.weatherapp(req.body.addr,(errorMessage, results)=>{
      if(errorMessage){
        res.send(`Err: ${errorMessage}`);
      }else {
        res.render('weather.hbs',{
          pageTitle: 'Weather',
          addr: req.body.addr,
          lat: results.lat,
          lng: results.lng,
          temperature: results.temperature,
          apparentTemperature: results.apparentTemperature
        });
      }//${req.body.addr}目前室温 ${results.temperature}, 体表温度 ${results.apparentTemperature}
    });
});
app.listen(port, ()=>{
  console.log(`Server is up on port ${port}`);
});
