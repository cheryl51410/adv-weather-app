$(document).ready(function () {

  console.log("hello");

  weatherApp = {

    $targetArea: $("#weather"),

    weatherApiKey: "",

    lastLatitiude: "",
    lastLongitude: "",

    getFormData: function () {
      if (weatherApp.weatherApiKey === null || weatherApp.weatherApiKey === "") {
        weatherApp.weatherApiKey = $("#apikey").val().trim();
      }

      let zip = $("#zip").val().trim();
      if (zip === null || zip.length < 5) {
        weatherApp.$targetArea.html("Enter a valid zip code.");
      } else {
        weatherApp.getWeatherData(zip);
      }

      console.log(weatherApp.weatherApiKey);

    },

    getWeatherData: function (zipcode) {
  //    let url = "//api.openweathermap.org/data/2.5/weather?zip=" + zipcode + ",us&appid=" + weatherApp.weatherApiKey + "&units=imperial";

      let url = "testData/test.json"

      $.getJSON(url, function (data) {
        if (data.cod == 200) {
      //    weatherApp.$targetArea.html("Success!");

          // THIS IS WHERE YOU WOULD ADD THE DATA TO THE PAGE
          $("#form").hide();
          let city = data.name,
              currentTemp = Math.round(data.main.temp),
              dayHigh = Math.round(data.main.temp_max),
              dayLow = Math.round(data.main.temp_min),
              pressure = Math.round(data.main.pressure),
              humidity = Math.round(data.main.humidity);
          // Add the city name
          // Add the current temperature, the day's low & high temp, current pressure, & current humidity
          $("#weather:contains('Enter a valid zip code.')").empty(); //Removes error message if it is present
          $("#weather:contains('Sorry, no weather data available. Try again later.')").empty(); //Removes error message if it is present
          let newDiv = document.createElement("DIV");
            newDiv.id = "weather-data";
            newDiv.style.cssText = "width:450px;margin:20px auto;border: 2px solid rebeccapurple;background-color:lemonchiffon";
          let addHTLM = "";
          let header = "<h4 style='text-align:center;margin:10px 0 0 0'><u>Current Weather Conditions</u></h4>",
              addCity = "<li style ='display:inline'>" + city + "</li>",
              addTemp = "<li style ='display:inline;margin-left:200px'>" + currentTemp + "&#8457</li>",
              addHigh = "<li style ='display:inline'>High: " + dayHigh + "&#8457</li>",
              addHumidity = "<li style ='display:inline;margin-left:125px'>Humidity: " + humidity + "%</li>",
              addLow = "<li style ='display:inline'> Low:  " + dayLow + "&#8457</li>",
              addPress = "<li style ='display:inline;margin-left:125px'>Pressure: " + pressure + "</li>";
          $("#weather").prepend(newDiv);
          let addHTML = header + "<ul style='list-style-type:none'>" + addCity + addTemp + "</ul>";
          addHTML += "<ul style='margin-top:5px;margin-bottom:0;list-style-type:none;font-size:20px'>" + addHigh + addHumidity + "</ul>";
          addHTML += "<ul style='margin-top:0;list-style-type:none;font-size:20px'>" + addLow + addPress + "</ul>";
          $("#weather-data").append(addHTML);
          // Add the weather condition descriptions, all of them, comma separated
          htmlCode = "<ul style='margin-top:5px;list-style-type:none'>";
          $.each(data.weather, function(index){
            description = data.weather[index].description;
            let weatherDesc = description.charAt(0).toUpperCase() + description.slice(1);
            htmlCode += "<li style='display:inline;font-size:20px'>" + weatherDesc + ", ";
          }); //end of weather description loop
          addDesc = htmlCode.slice(0, -2);
          addDesc += "</li></ul>";
          $("#weather-data").append(addDesc);
          let closeBtn = document.createElement("BUTTON");
            closeBtn.id = "close-button";
            closeBtn.style.cssText = "margin:0 0 5px 350px;background-color:rebeccapurple;font-size:15px;color:white;border-radius:25px";
          let btnText = document.createTextNode("Close");
          closeBtn.appendChild(btnText);
          $("#weather-data").append(closeBtn);
          $("#close-button").on("click", function(){
              window.location.reload(); //refreshes the page to start over
          });
          // Get the lat & longitude from the result and save
          weatherApp.lastLatitiude = data.coord.lat;
          weatherApp.lastLongitude = data.coord.lon;

          // Add a button for 5 day forcast --added text-align to center button with added weather-data div
          weatherApp.$targetArea.append('<div id="5day" style="text-align:center"><button id="fiveDay">Get 5 Day Forecast</button></div>');
          $("#fiveDay").on("click", weatherApp.getFiveDayWeather);

        } else {
          weatherApp.$targetArea.html("Sorry, no weather data available. Try again later.");
        }
      }).fail(function () {
        weatherApp.$targetArea.html("Sorry, no weather data available. Try again later.");
      });
    }, //end of getWeatherData

    getFiveDayWeather: function () {
  //  let url = "//api.openweathermap.org/data/2.5/forecast?lat=" + weatherApp.lastLatitiude + "&lon=" + weatherApp.lastLongitude + "&appid=" + weatherApp.weatherApiKey + "&units=imperial";

    let url = "testData/test5day.json"

      $.getJSON(url, function (data) {
        let $target = $("#5day")
        if (data.cod == 200) {
      //    $target.html("Success!");
          $("#weather-data").each(function(){
              $(this).remove();
          })
          $("#5day").hide();
          let city = data.city.name;
          $("#weather").prepend("<h4 style='margin-bottom:10px'>5 Day forecast for " + city + "</h4>");
          let newTable = document.createElement("TABLE");
            newTable.id = "5day-table";
            newTable.style.cssText = "width:100%";
          $("#weather").append(newTable);
          $("#5day-table").append("<tr>");
          $("#5day-table tr").append("<th align='left'>Date/Time</th>");
          $("#5day-table tr").append("<th align='left'>Temperature</th>");
          $("#5day-table tr").append("<th align='left'>High/Low</th>");
          $("#5day-table tr").append("<th align='left'>Humidity</th>");
          $("#5day-table tr").append("<th align='left'>Pressure</th>");
          $("#5day-table tr").append("<th align='left'>Conditions</th></tr>");

          // THIS IS WHERE YOU WOULD ADD THE 5 DAY FORCAST DATA TO THE PAGE
          // For each of the 5 days, at each time specified, add the date/time plus:
          //   - the weather condition descriptions, all of them, comma separated
          //   - day's temp, low & high temp, pressure, humidity
          htmlCode = "";
          $.each(data.list, function(index){
            let dateTime = data.list[index].dt_txt,
                currentTemp = Math.round(data.list[index].main.temp),
                dayHigh = Math.round(data.list[index].main.temp_max),
                dayLow = Math.round(data.list[index].main.temp_min),
                pressure = Math.round(data.list[index].main.pressure),
                humidity = Math.round(data.list[index].main.humidity);
            htmlCode += "<tr style='font-size:15px'>";
            htmlCode += "<td>" + dateTime + "</td>";
            htmlCode += "<td>" + currentTemp + "&#8457</td>";
            htmlCode += "<td>" + dayHigh + "&#8457/ " + dayLow + "&#8457</td>";
            htmlCode += "<td>" + humidity + "%</td>";
            htmlCode += "<td>" + pressure + "</td>";
            let conditions = (data.list[index].weather);
            weatherDesc = "";
            $.each(conditions, function(index){
              let desc = conditions[index].description;
              let descCaps = desc.charAt(0).toUpperCase() + desc.slice(1);
              weatherDesc += descCaps + ", ";
            }); //end of weather description loop
            htmlCode += "<td>" + weatherDesc.slice(0, -2) + "</td>";
            htmlCode += "</tr>";
            $("#5day-table tbody").append(htmlCode);
            htmlCode = "";
          }); //end of data.list loop
          let resetBtn = document.createElement("BUTTON");
            resetBtn.id = "reset-button";
            resetBtn.style.cssText = "margin:0 0 5px 350px;background-color:rebeccapurple;font-size:15px;color:white;border-radius:25px";
          let btnText = document.createTextNode("Reset");
          resetBtn.appendChild(btnText);
          $("#weather h4").append(resetBtn);
          $("#reset-button").on("click", function(){
            window.location.reload();
          });

        } else {
          $target.html("Sorry, 5 day forcast data is unavailable. Try again later.");
        }
      }).fail(function () {
        weatherApp.$targetArea.html("Sorry, 5 day forcast data is unavailable. Try again later.");
      });
    } //end of getFiveDayWeather
} //end of weatherApp
  // Form submit handler
  $("#submit").click(function () {
    weatherApp.getFormData();
    return false;
  });
}); //end of program
