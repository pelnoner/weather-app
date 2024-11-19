//returns an array with current day, month, date, hour and minute information
// like ['FRIDAY', 'SEPTEMBER', 1, 20, 22]
function currentDate() {
  let now = new Date();
  let date = now.getDate();

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  month = month.toUpperCase();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  day = day.toUpperCase();

  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentDateInfo = [day, month, date, hour, minutes];
  //return `${day}, ${month} ${date}, ${hour}:${minutes}`;
  return currentDateInfo;
}

//updates the day and time field in the page with current day and time values
// i.e. FRIDAY 20:22
function updateDayTime(currentDateInfo) {
  let currentDay = document.querySelector("#current-day-word");
  currentDay.innerHTML = currentDateInfo[0];

  let currentTime = document.querySelector("#current-time");
  currentTime.innerHTML = `${currentDateInfo[3]}:${currentDateInfo[4]}`;

  if (currentDateInfo[3] >= 19) {
    let currentBackground = document.getElementById("cont");
    currentBackground.style.background = "url(images/dallenight.png)";
    currentBackground.style.backgroundSize = "cover";
  }
}
updateDayTime(currentDate());

//updates the month and date field in the page with current month and date values
// i.e. SEPTEMBER 23
function updateMonthDate(currentDateInfo) {
  let currentMonth = document.querySelector("#current-month");
  currentMonth.innerHTML = currentDateInfo[1];

  let currentDate = document.querySelector("#current-date");
  currentDate.innerHTML = currentDateInfo[2];
}
updateMonthDate(currentDate());

//stores the city user searches as inputCity. Then calls function to get weather data for the city
function updateCurrentCity(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#city-input");
  inputCity = inputCity.value.trim();
  if (inputCity) {
    inputCity = inputCity.toUpperCase();
    getWeatherDataFromSearch(inputCity);
    searchForm.reset();
  } else {
    alert("Please enter a city to search");
  }
}
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", updateCurrentCity);

//gets weather data for the city user searches then calls function to update the page with current weather data
function getWeatherDataFromSearch(inputCity) {
  let apiKey = "894a2e7aa7f46eeca5d8778f6faa5a5b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=metric`;
  let degreeType = document.querySelector("#degree-type");
  if (degreeType.innerHTML.trim() === "°F") {
    convertToCelsius();
  }
  let weatherData = axios.get(apiUrl);
  weatherData.then(updateCityFromLocation);
  weatherData.then(updateWeatherData);
  weatherData.then(updateCurrentIcon);
  //weatherData.then(displayForecast);
}
getWeatherDataFromSearch("Los Angeles");

//gets current city from the weather data and updates the page with current city
function updateCityFromLocation(response) {
  let currentCity = response.data.name;
  currentCity = currentCity.toUpperCase();
  let cityToUpdate = document.querySelector("#current-city");
  cityToUpdate.innerHTML = currentCity;
}

//updates page with current weather data and forecast data
function updateWeatherData(response) {
  getForecastAPI(response.data.coord);
  //update current temperature at current location
  let temp = Math.round(response.data.main.temp);
  let currentTemp = document.querySelector("#current-temperature");
  currentTemp.innerHTML = `${temp}`;
  //update conditions at current location
  let conditions = response.data.weather[0].description;
  let condDoc = document.querySelector("#conditions");
  condDoc.innerHTML = `${conditions}`;
  //update feels like temperature at current location
  let feelsLike = Math.round(response.data.main.feels_like);
  let feelDoc = document.querySelector("#feels-like");
  feelDoc.innerHTML = `${feelsLike}`;
  //update max temperature at current location
  let maxTemp = Math.round(response.data.main.temp_max);
  let highTemp = document.querySelector("#high-temp");
  highTemp.innerHTML = `${maxTemp}`;
  //update min temperature at current location
  let minTemp = Math.round(response.data.main.temp_min);
  let lowTemp = document.querySelector("#low-temp");
  lowTemp.innerHTML = `${minTemp}`;
  //update wind speed at current location
  let windSpeed = Math.round(response.data.wind.speed);
  let wind = document.querySelector("#wind");
  wind.innerHTML = `Wind: ${windSpeed * 3.6} km/h`;
  //update humidity at current location
  let humidity = response.data.main.humidity;
  let humDoc = document.querySelector("#humidity");
  humDoc.innerHTML = `Humidity: ${humidity} %`;
  //update visibility at current location
  let visibility = response.data.visibility;
  let visDoc = document.querySelector("#visibility");
  visDoc.innerHTML = `Visibility: ${Math.round(visibility * 0.001)} km`;
}

//update current condition icon according to weather classification
function updateCurrentIcon(response) {
  let weathercondition = response.data.weather[0].main;
  weathercondition = weathercondition.toUpperCase();
  if (weathercondition == "RAIN") {
    let currentIcon = document.querySelector("#current-icon");
    currentIcon.src = "images/rain.png";
  } else if (weathercondition == "SNOW") {
    let currentIcon = document.querySelector("#current-icon");
    currentIcon.src = "images/snow.png";
  } else if (weathercondition == "CLEAR") {
    let currentIcon = document.querySelector("#current-icon");
    currentIcon.src = "images/sun.png";
  } else if (weathercondition == "CLOUDS") {
    let currentIcon = document.querySelector("#current-icon");
    currentIcon.src = "images/clouds.png";
  } else if (weathercondition == "THUNDERSTORM") {
    let currentIcon = document.querySelector("#current-icon");
    currentIcon.src = "images/thunderstorm.png";
  } else if (weathercondition == "DRIZZLE") {
    let currentIcon = document.querySelector("#current-icon");
    currentIcon.src = "images/rain.png";
  } else {
    let currentIcon = document.querySelector("#current-icon");
    currentIcon.src = "images/haze.png";
  }
}

//gets weather data for the geolocation then calls function to update the page with weather data
function getWeatherDataFromLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "894a2e7aa7f46eeca5d8778f6faa5a5b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  let weatherData = axios.get(apiUrl);
  weatherData.then(updateCityFromLocation);
  weatherData.then(updateWeatherData);
  weatherData.then(updateCurrentIcon);
}

//calls getWeatherDataFromLocation function when location button is clicked
function clickLocationButton(event) {
  event.preventDefault();
  let degreeType = document.querySelector("#degree-type");
  if (degreeType.innerHTML.trim() === "°F") {
    convertToCelsius();
  }
  navigator.geolocation.getCurrentPosition(getWeatherDataFromLocation);
}
let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", clickLocationButton);

//converts the current temperature to Fahrenheit and updates the page with Fahrenheit values
function convertToFahrenheit() {
  //converts current city main info card data
  let degreeType = document.querySelector("#degree-type");

  if (degreeType.innerHTML.trim() === "°C") {
    let currentTemperature = document.querySelector("#current-temperature");

    currentTemperature.innerHTML = Math.round(
      currentTemperature.innerHTML * 1.8 + 32
    );
    let feels = document.querySelector("#feels-like");
    feels.innerHTML = Math.round(feels.innerHTML * 1.8 + 32);
    let highTemperature = document.querySelector("#high-temp");
    highTemperature.innerHTML = Math.round(
      highTemperature.innerHTML * 1.8 + 32
    );
    let lowTemperature = document.querySelector("#low-temp");
    lowTemperature.innerHTML = Math.round(lowTemperature.innerHTML * 1.8 + 32);
    //converts forecast data
    /*let days = [1, 2, 3, 4, 5];
    days.forEach(function (day) {
      let forecastHigh = document.querySelector(`#forecast-high-${day}`);
      forecastHigh.innerHTML = Math.round(forecastHigh.innerHTML * 1.8 + 32);
      let forecastLow = document.querySelector(`#forecast-low-${day}`);
      forecastLow.innerHTML = Math.round(forecastLow.innerHTML * 1.8 + 32);
    }); */

    let allDegrees = document.querySelectorAll("#degree-type");
    allDegrees.forEach((Element) => (Element.innerHTML = "°F"));
  } else {
    return false;
  }
}
let fahrenheitButton = document.querySelector("#fahrenheit-button");
fahrenheitButton.addEventListener("click", convertToFahrenheit);

//converts the current temperature to Celsius and updates the page with Celsius values
function convertToCelsius() {
  //converts current city main info card data
  let degreeType = document.querySelector("#degree-type");

  if (degreeType.innerHTML.trim() === "°F") {
    let currentTemperature = document.querySelector("#current-temperature");

    currentTemperature.innerHTML = Math.round(
      (currentTemperature.innerHTML - 32) / 1.8
    );
    let feels = document.querySelector("#feels-like");
    feels.innerHTML = Math.round((feels.innerHTML - 32) / 1.8);
    let highTemperature = document.querySelector("#high-temp");
    highTemperature.innerHTML = Math.round(
      (highTemperature.innerHTML - 32) / 1.8
    );
    let lowTemperature = document.querySelector("#low-temp");
    lowTemperature.innerHTML = Math.round(
      (lowTemperature.innerHTML - 32) / 1.8
    );
    //converts forecast data
    /*let days = [1, 2, 3, 4, 5];
    days.forEach(function (day) {
      let forecastHigh = document.querySelector(`#forecast-high-${day}`);
      forecastHigh.innerHTML = Math.round((forecastHigh.innerHTML - 32) / 1.8);
      let forecastLow = document.querySelector(`#forecast-low-${day}`);
      forecastLow.innerHTML = Math.round((forecastLow.innerHTML - 32) / 1.8);
    });*/
    let allDegrees = document.querySelectorAll("#degree-type");
    allDegrees.forEach((Element) => (Element.innerHTML = "°C"));
  } else {
    return false;
  }
}
let celsiusButton = document.querySelector("#celsius-button");
celsiusButton.addEventListener("click", convertToCelsius);

//adds forecast cards to html and updates the forecast details with following days and weather icons
function displayForecast(response) {
  let forecastElement = document.querySelector("#next-forecast");
  let forecastHTML = ``;
  let days = [1, 2, 3, 4, 5];
  days.forEach(function (day) {
    var i = 0;
    var data = { list: [{ dt: response.data.daily[day].dt }] };
    //console.log(data.list[i].dt);
    var weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var dayNum = new Date(data.list[i].dt * 1000).getDay();
    //console.log(dayNum);
    var result = weekdays[dayNum];
    //console.log(result);

    let weathercondition = response.data.daily[day].weather[0].main;
    weathercondition = weathercondition.toUpperCase();
    let forecastIconUrl = "images/snow.png";
    if (weathercondition == "RAIN") {
      forecastIconUrl = "images/rain.png";
    } else if (weathercondition == "SNOW") {
      forecastIconUrl = "images/snow.png";
    } else if (weathercondition == "CLEAR") {
      forecastIconUrl = "images/sun.png";
    } else if (weathercondition == "CLOUDS") {
      forecastIconUrl = "images/clouds.png";
    } else if (weathercondition == "THUNDERSTORM") {
      forecastIconUrl = "images/thunderstorm.png";
    } else if (weathercondition == "DRIZZLE") {
      forecastIconUrl = "images/rain.png";
    } else {
      forecastIconUrl = "images/haze.png";
    }

    forecastHTML =
      forecastHTML +
      `
  <div class="card">
            <img
            id = "forecast-icon"
              src=${forecastIconUrl}
              class="card-img-top"
              style="max-width: 100%; height: auto"
            />
            <div class="card-body">
              <h5 class="card-title">${result}</h5>
              <p class="card-text">High: <span id="forecast-high-${day}">${Math.round(
        response.data.daily[day].temp.max
      )}</span><span id="degree-type">°C</span></p>
              <p class="card-text">Low: <span id="forecast-low-${day}">${Math.round(
        response.data.daily[day].temp.min
      )}</span><span id="degree-type">°C</span></p>
            </div>
          </div>`;
  });

  forecastElement.innerHTML = forecastHTML;
}

//pulls forecast weather information from the API
function getForecastAPI(coordinates) {
  let apiKey = "63214c4281922e3bb72fdf12dada7734";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(displayForecast);
}
