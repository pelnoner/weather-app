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

//console.log(currentDate());

//updates the day and time field in the page with current day and time values
// i.e. FRIDAY 20:22
function updateDayTime(currentDateInfo) {
  let currentDay = document.querySelector("#current-day-word");
  currentDay.innerHTML = currentDateInfo[0];

  let currentTime = document.querySelector("#current-time");
  currentTime.innerHTML = `${currentDateInfo[3]}:${currentDateInfo[4]}`;
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

//gets weather data for the city user searches then calls function to update the page with weather data
function getWeatherDataFromSearch(inputCity) {
  let apiKey = "894a2e7aa7f46eeca5d8778f6faa5a5b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=metric`;
  let weatherData = axios.get(apiUrl);
  weatherData.then(updateCityFromLocation);
  weatherData.then(updateWeatherData);
}

//gets current city from the weather data and updates the page with current city
function updateCityFromLocation(response) {
  let currentCity = response.data.name;
  currentCity = currentCity.toUpperCase();
  let cityToUpdate = document.querySelector("#current-city");
  cityToUpdate.innerHTML = currentCity;
}

//updates page with weather data
function updateWeatherData(response) {
  console.log(response.data);
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

//gets weather data for the geolocation then calls function to update the page with weather data
function getWeatherDataFromLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "894a2e7aa7f46eeca5d8778f6faa5a5b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  let weatherData = axios.get(apiUrl);
  weatherData.then(updateCityFromLocation);
  weatherData.then(updateWeatherData);
}

function clickLocationButton(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getWeatherDataFromLocation);
}
let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", clickLocationButton);

//converts the current temperature to Fahrenheit and updates the page with Fahrenheit values
function convertToFahrenheit() {
  //update current city main info card
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
  //update current city main info card
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
    let allDegrees = document.querySelectorAll("#degree-type");
    allDegrees.forEach((Element) => (Element.innerHTML = "°C"));
  } else {
    return false;
  }
}
let celsiusButton = document.querySelector("#celsius-button");
celsiusButton.addEventListener("click", convertToCelsius);
