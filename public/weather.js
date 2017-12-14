//the api documentation link https://openweathermap.org/current
//the name of the api is OpenWeatherMap
var apiKey = "b08856baeffacfa7bddb7b3763481a70";

//this function retrieves data from the api for any given city name and then renders the table
function getWeather(cityID){
  $.ajax({
    url: 'https://api.openweathermap.org/data/2.5/weather?q='+ cityID + '&APPID='+ apiKey,
    success: function(data){
      renderTable(data);
    },
  })
}

//this function sends a notification to the console if the api call is successful
$("#cityForm").submit(function(event){
  getWeather($("#userCity").val());
  console.log("successful form submit")
  event.preventDefault();
});


//this function creates the table using the data from the api
function renderTable(data){
  var comment = 277 > data.main.temp ? 'keep your pants on' : 'null'
  var comment = 277 < data.main.temp && data.main.temp < 289 ? 'Perfect weather to waste another day' : comment;
  var comment = 289 < data.main.temp ? 'Its hot. Ryan Gosling hot.' : comment;
  var table = `
  <table id="weatherTable">
    <tr>
      <th> Description </th>
      <th> Temperature (K) </th>
      <th> Wind </th>
    </tr>
    <tr>
      <th>${data.weather[0].description}</th>
      <th>${data.main.temp}</th>
      <th>${data.wind.speed}</th>

  </table>
  <br></br>
  <div id="comment">
  <br></br>
    ${comment}
  </div>
  `


  $("#targetDiv").html(table);

}

//This changes from the form to the results page
$("#main").hide();
$("#indexForm").submit(function(event){
  $("#index").hide();
  $("#main").show();

  event.preventDefault();
})

//this fades out the images and the table when clicked
$("#targetDiv").click(function(){
        $("#targetDiv").fadeOut();

    });


var socket = io();

$('#chatform').submit(function(event){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  event.preventDefault();
});

socket.on('chat message', function(msg){
  $('#chat_body').append(`<tr><td> ${msg} </td></tr>`);
});
