const welcomeDiv = document.getElementById("welcome-div");
const tableDiv = document.getElementById("table-div");
const resultDiv = document.getElementById("result-div");
const errorDiv = document.getElementById("error-div");
const homeLink = document.getElementById("home");
const body = document.body;

const inputText = document.getElementById("input");
const searchBtn = document.getElementById("search");

const statistics = document.getElementById("statistics");
const forecast = document.getElementById("hourly-forecast");

const API_KEY = "46947e8e71204bbdb2eb18c3cbb84605";

function Weather(data) {
    this.city = data.city.name;
    this.country = data.city.country;
    this.currentTemp = Math.round(data.list[0].main.temp);
    this.currentHumidity = data.list[0].main.humidity;
    this.currentIcon = data.list[0].weather[0].icon;
    this.hourlyForecast = data.list;

    this.minHumidity = function () {
        let humidities = this.hourlyForecast
            .map(forecast => forecast.main.humidity);
        let minHum = humidities[0];

        humidities.forEach(humidity => {
            if (minHum > humidity) {
                minHum = humidity;
            }
        })
        return minHum;
    }

    this.maxHumidity = function () {
        let humidities = this.hourlyForecast
            .map(forecast => forecast.main.humidity);
        let maxHum = humidities[0];

        humidities.forEach(humidity => {
            if (maxHum < humidity) {
                maxHum = humidity;
            }
        })
        return maxHum;
    }

    this.averageHumidity = function () {
        let humidities = this.hourlyForecast
            .map(forecast => forecast.main.humidity)
            .reduce((sum, humidity) => sum += humidity, 0);

        return humidities / this.hourlyForecast.length;
    }

    this.minTemperature = function () {
        let temperatures = this.hourlyForecast.map(forecast => forecast.main.temp);
        let minTemp = temperatures[0];

        temperatures.forEach(temperature => {
            if (minTemp > temperature) {
                minTemp = temperature;
            }
        })
        return minTemp;
    }

    this.maxTemperature = function () {
        let temperatures = this.hourlyForecast.map(forecast => forecast.main.temp);
        let maxTemp = temperatures[0];

        temperatures.forEach(temperature => {
            if (maxTemp < temperature) {
                maxTemp = temperature;
            }
        })
        return maxTemp;
    }

    this.averageTemperature = function () {
        let temperatures = this.hourlyForecast
            .map(forecast => forecast.main.temp)
            .reduce((sum, temperature) => sum += temperature, 0);

        return temperatures / this.hourlyForecast.length;
    }

    this.warmestDay = function () {
        let maxTemp = this.hourlyForecast[0].main.temp;
        let warmestDay = this.hourlyForecast[0].dt_txt

        for (let i = 0; i < this.hourlyForecast.length; i++) {
            if (maxTemp < this.hourlyForecast[i].main.temp) {
                maxTemp = this.hourlyForecast[i].main.temp;
                warmestDay = this.hourlyForecast[i].dt_txt;
            }
        }
        return formatString(warmestDay);
    }

    this.coldestDay = function () {
        // let temperatures = this.hourlyForecast.map(forecast => forecast.main.temp)
        let minTemp = this.hourlyForecast[0].main.temp;
        let coldestDay = this.hourlyForecast[0].dt_txt;
        for (let i = 0; i < this.hourlyForecast.length; i++) {
            if (minTemp > this.hourlyForecast[i].main.temp) {
                minTemp = this.hourlyForecast[i].main.temp;
                coldestDay = this.hourlyForecast[i].dt_txt;
            }
        }
        return formatString(coldestDay)
    }


}

function formatString(str) {
    return `${str.slice(8, 10)}.${str.slice(5, 7)}.${str.slice(0, 4)}, ${str.slice(-8, -3)}`
}

homeLink.addEventListener("click", () => {
    displayNone(tableDiv, resultDiv, errorDiv);
    welcomeDiv.style.display = "flex";
})

searchBtn.addEventListener("click", ev => {
    if (inputText.value === "") return;

    let newCity = inputText.value;

    getData(newCity).then(newWeather => {

        forecast.addEventListener("click", () => {
            removeChildren(tableDiv);
            displayNone(welcomeDiv, resultDiv, errorDiv)
            tableDiv.style.display = "flex";
            let h3 = document.createElement("h3");
            h3.textContent = `Weather forecast stats for every 3 hours in ${newWeather.city}`;
            tableDiv.appendChild(h3);
            createTable(newWeather.hourlyForecast);
        })

        statistics.addEventListener("click", e => {
            removeChildren(resultDiv);
            displayNone(welcomeDiv, tableDiv, errorDiv)
            resultDiv.style.display = "flex"
            console.log("Stats");

            // let coldest = newWeather.coldestDay()
            // let temperature123 = newWeather.warmestDay()
        })
    })
    inputText.value = "";
})


async function getData(input) {
    try {
        let res = await fetch
            (`https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&APPID=${API_KEY}`);
        // console.log(res)
        let data = await res.json();
        console.log(data)

        if (data.cod < 200 || data.cod > 299) {
            displayNone(welcomeDiv, resultDiv, tableDiv);
            errorDiv.style.display = "flex";
            inputText.focus();
            return;
        }
        // if (data.message !== 0) return;

        // if (data.message === "Nothing to geocode"
        //     || data.message === "city not found") {
        //     return
        // }

        const newWeather = new Weather(data);
        console.log(newWeather);

        console.log(newWeather.coldestDay())
        console.log(newWeather.warmestDay())
        // console.log(newWeather.averageHumidity)
        // let abcdeHumidity = newWeather.averageHumidity()
        // console.log(abcdeHumidity)
        // console.log(newWeather(coldestDay))

        return newWeather;

    } catch (error) {
        console.log("Something went wrong, please try again later", error);
        console.log(error);

        // removeChildren(errorDiv);
        displayNone(welcomeDiv, resultDiv, tableDiv)
        errorDiv.style.display = "flex";
        // const h1 = document.createElement("h1");
        // h1.textContent = "CITY NOT FOUND. TRY AGAIN!";
        // errorDiv.appendChild(h1);
    }
}

function createTable(hourlyForecast) {
    let columnNames =
        ['Icon', 'Description', 'Date and Time', 'Temperature (℃)', 'Humidity (%)', 'Wind Speed (m/s)'];
    let table = document.createElement('table');
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let tr = document.createElement('tr');
    tr.classList.add("sticky");

    for (let column of columnNames) {
        let th = document.createElement('th');
        th.textContent = column;
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    table.appendChild(thead);

    for (let hour of hourlyForecast) {
        let tableRow = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerHTML = `<img src="http://openweathermap.org/img/w/${hour.weather[0].icon}.png">`;
        tableRow.appendChild(td1);

        let td2 = createTd(hour.weather[0].description);
        tableRow.appendChild(td2);

        let td3 = createTd(hour.dt_txt);
        tableRow.appendChild(td3);

        let td4 = createTd(Math.round(hour.main.temp));
        tableRow.appendChild(td4);

        let td5 = createTd(hour.main.humidity);
        tableRow.appendChild(td5);

        let td6 = createTd(hour.wind.speed);
        tableRow.appendChild(td6);

        tbody.appendChild(tableRow);
    }

    table.appendChild(tbody);
    tableDiv.appendChild(table);
}

function createTd(textContent) {
    const td = document.createElement('td');
    td.textContent = textContent;
    return td;
}

function removeChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function displayNone(element1, element2, element3) {
    element1.style.display = "none";
    element2.style.display = "none";
    element3.style.display = "none";
}