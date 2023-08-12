var apiKey = "f2121762395955c7d6494cc0e3d06558";
var searchForm = document.getElementById("search_box");
var searchCity = document.getElementById("city-input");
var searchButton = document.getElementById("searchButton");
var historyList = document.getElementById("history_list");
var searchedCityEl = document.getElementById("searchedCity");
var todayWeather = document.getElementById("current-weather");
var forecastWeather = document.getElementById("forecast");
var historyCities = document.querySelectorAll(".history-city");
var searchHistory = [];

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  var cityName = searchCity.value;
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`
  )
    .then((response) => response.json())
    .then((data) => {
      displayData(data);
      addToHistory(cityName);
      fetchWeatherData(cityName);
    })
    .catch((err) => {
      alert("Error fetching weather data. Please check the city name.");
    });
});



function addToHistory(cityName) {
  if (!searchHistory.includes(cityName)) {
    searchHistory.push(cityName);
    updateHistory();
    saveHistory();
  }
}
function saveHistory(){
  localStorage.setItem("searchHistory",JSON.stringify(searchHistory));
}


function updateHistory() {
  
  historyList.innerHTML = searchHistory
    .map((city) => `<li class="history-city">${city}</li>`)
    .join("");

  
       
  
    historyCities.forEach((historyCity) => {
      historyCity.addEventListener("click", () => {
        var cityName = historyCity.textContent; // Get the city name from the clicked history item
        fetchWeatherData(cityName); // Fetch weather data for the clicked city
      });
    });
  }

function loadHistoryFromLocalStorage() {
  const storedHistory = localStorage.getItem("searchHistory");
  if (storedHistory) {
    
    searchHistory = JSON.parse(storedHistory);
    updateHistory();
  }
}

function fetchWeatherData(cityName) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
      displayData(data);
    })
    .catch(err => {
      alert("Error fetching weather data. Please check the city name.");
    });
}

document.addEventListener("DOMContentLoaded", loadHistoryFromLocalStorage);






















var displayData = (weather) => {
  /* Display current weather data here */
  todayWeather.innerHTML = `
    <h2>Current Weather</h2>
    <ul>
    <li>
    <p>${weather.name}</p>
    <img src="https://openweathermap.org/img/w/${weather.weather[0].icon}.png" alt="Weather Icon">
    <p>Temperature: ${weather.main.temp}°F</p>
    <p>Humidity: ${weather.main.humidity}%</p>
    <p>Wind Speed: ${weather.wind.speed} m/s</p>
    </li>
    </ul>
  `;

  /* Display the 5-day forecast data here */
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${weather.name}&appid=${apiKey}&units=imperial`
  )
    .then((response) => response.json())
    .then(displayForecast)
    .catch((err) => {
      console.error("Error fetching forecast data.", err);
    });
};

var displayForecast = (forecast) => {
  /* Display 5-day forecast data */
  forecastWeather.innerHTML = `
    <h2>5-Day Forecast</h2>
    <ul>
      ${forecast.list
        .map(
          (item) => `
          <li>
            <p>Date: ${item.dt_txt}</p>
            <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png">
            <p>Temperature: ${item.main.temp}°F</p>
            <p>Humidity: ${item.main.humidity}%</p>
            <p>Wind Speed: ${item.wind.speed} m/s</p>
          </li>
        `
        )
        .join("")}
    </ul>
  `;
};
