/*
 * Export an init method that will define a set of routes
 * handled by this file.
 * @param app - The Express app
 */
exports.init = function(app) {
  app.get("/forecast/:city?", getHandler);
  app.put("/forecast/:city/:temp/:precip", putForecast);
  app.post("/forecast/:city/:temp/:precip", postForecast);
  app.delete("/forecast/:city", deleteForecast);
}

var Forecast = require("../models/forecast.js");
var forecastCollection = [];

showForecasts = function(req, res){
    console.log(JSON.stringify(forecastCollection));
    res.render("forecasts", { forecastCollection: forecastCollection});
}

getHandler = function(request, response){
    if(request.params.city){
      getForecast(request, response);
    }
    else{
      showForecasts(request, response);
    }
}

// Handle the getForecast route
getForecast = function(request, response) {
    let query = new Forecast(request.params.city, "","");
    let weather = forecastCollection[findForecastIndex(query)];
    if (weather){
      response.send("Found " + JSON.stringify(weather));
    }
    else{
      response.send("Not Found");
    }
  }

//Handle the putForecast route
putForecast = function(request, response) {

    let weather = new Forecast(request.params.city, request.params.temp, request.params.precip);
    if (weather){
      forecastCollection.push(weather);
      response.send("Created " + JSON.stringify(weather));
    }
    else{
      response.send("Not Found");
    }
  }

postForecast = function(request, response){
  let query = new Forecast(request.params.city, request.params.temp, request.params.precip);
  let weather = forecastCollection[findForecastIndex(query)];
  if (weather){
    forecastCollection[findForecastIndex(query)] = query;
    response.send("Updated " + JSON.stringify(weather));
  }
  else{
    response.send("Not Found");
  }
}

deleteForecast = function(request, response){
  let query = new Forecast(request.params.city, "","");
  let weather = forecastCollection[findForecastIndex(query)];
  if (weather){
    let index = findForecastIndex(query);
    forecastCollection = forecastCollection.splice(index,1);
    if(forecastCollection.length==1){
      forecastCollection = [];
    }
    response.send("Deleted " + JSON.stringify(weather));
  }
  else{
    response.send("Not Found");
  }
}

findForecastIndex = function(query){
  for(let i = 0; i < forecastCollection.length; i++){
    if(query.city == forecastCollection[i].city){
      return i;
    }
  }
}
