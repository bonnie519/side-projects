const request = require('request');
const axios = require('axios');//promise based HTTP client for browser and node.js

var weatherapp = (address, callback)=>{
  var encodeAddress = encodeURIComponent(address);
  var geocodeUrl = `http://api.map.baidu.com/geocoder/v2/?output=json&ak=LnyRpG5KzEHzzsvz4Hx8ICTv&address=${encodeAddress}`;

  axios.get(geocodeUrl).then((response)=>{
    if(response.data.status !== 0){
      throw new Error('Unable to find that address.');
    }

    var lat = response.data.result.location.lat;
    var lng = response.data.result.location.lng;
    var weatherUrl =`https://api.darksky.net/forecast/43746d19402a8709cb29b7cbdd446f24/${lat},${lng}?units=si&lang=zh`;
    //console.log(response.data.result.location);

    return new Promise((resolve,reject)=>{
      axios.get(weatherUrl).then((response)=>{
          callback(undefined,{
            lat: lat,
            lng: lng,
            temperature: response.data.currently.temperature,
            apparentTemperature: response.data.currently.apparentTemperature
          });
      }, (errorMessage)=>{
        callback(errorMessage);
      });

    });//axios.get(weatherUrl);
  })
  // .then((response)=>{
  //   console.log(`${lat} ${lng}`);
  //   callback(undefined,{
  //     temperature: response.data.currently.temperature,
  //     apparentTemperature: response.data.currently.apparentTemperature
  //   });
  //   // var temperature = response.data.currently.temperature;
  //   // var apparentTemperature = response.data.currently.apparentTemperature;
  //   //console.log(`室温 ${temperature}， 体感温度 ${apparentTemperature}`);
  // })
  .catch((e)=>{
    if(e.code === 'ETIMEDOUT'){
      callback('unable to connect to BAIDU Map server');
    } else{
      callback(e.message);
    }
  });
};

module.exports.weatherapp = weatherapp;
//lat,lng,callback

// geocode.geocodeAddress(argv.a,(errorMessage, results)=>{
//   if(errorMessage){
//     console.log(errorMessage);
//   }else{
//     //console.log('Successfully fetch data');
//     //console.log(JSON.stringify(results,undefined,2));
//     //console.log(`lat: ${results.latitude} lng: ${results.longitude}`);
//     weather.getWeather(results.latitude,results.latitude,(errorMessage,weatherResults)=>{
//       if(errorMessage){
//         console.log(errorMessage);
//       }else {
//         //console.log(JSON.stringify(weatherResults,undefined,2));
//         console.log(`目前温度 ${weatherResults.temperature}, ${weatherResults.cursummary}`);
//       //  console.log(`未来：${weatherResults.mintsummary}`);
//       }
//     });
//   }
// });



//https://api.forecast.io/forecast/mykey/lat,lng
