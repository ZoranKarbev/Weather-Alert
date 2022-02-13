const API_KEY = "46947e8e71204bbdb2eb18c3cbb84605";

const welcomeDiv = document.getElementById("welcome-div")
const tableDiv = document.getElementById("table-div");
const resultDiv = document.getElementById("result-div");
const errorDiv = document.getElementById("error-div");
const homeLink = document.getElementById("home");
console.log(homeLink);
const body = document.body;

const inputText = document.getElementById("input");
const searchBtn = document.getElementById("search");

const statistics = document.getElementById("statistics");
const forecast = document.getElementById("hourly-forecast");

function Weather(data) {
    this.city = data.city.name;
    this.country = data.city.country;
    this.currentTemp = Math.round(data.list[0].main.temp);
    this.currentHumidity = data.list[0].main.humidity;
    this.currentIcon = data.list[0].weather[0].icon;
    this.hourlyForecast = data.list
}

homeLink.addEventListener("click", () => {
    displayNone(tableDiv, resultDiv, errorDiv)
    welcomeDiv.style.display = "flex";

})

searchBtn.addEventListener("click", ev => {

    let newCity = inputText.value;

    getData(newCity).then(newWeather => {
        forecast.addEventListener("click", () => {
            removeChildren(tableDiv);
            displayNone(welcomeDiv, resultDiv, errorDiv)
            tableDiv.style.display = "flex";
            let h3 = document.createElement("h3");
            console.log(newWeather.city);
            h3.textContent = `Weather forecast stats for every 3 hours in ${newWeather.city}`;
            tableDiv.appendChild(h3);
            createTable(newWeather.hourlyForecast);
        })

        statistics.addEventListener("click", e => {
            removeChildren(resultDiv);
            displayNone(welcomeDiv, tableDiv, errorDiv)
            resultDiv.style.display = "flex"
            console.log("Stats");
        })
    })
    inputText.value = "";
})




async function getData(input) {
    try {
        const res = await fetch
            (`https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&APPID=${API_KEY}`);
        const data = await res.json();
        console.log(data);
        const newWeather = new Weather(data);
        console.log(newWeather);
        return newWeather;

    } catch (error) {
        console.log("Something went wrong, please try again later", error);
        // displayNone(welcomeDiv, tableDiv, resultDiv);
        const h1 = document.createElement("h1");
        h1.textContent = "CITY NOT FOUND. TRY AGAIN!";
        h1.style.color = "white";
        h1.style.textShadow = "0.1rem 0.1rem #31022c"
        errorDiv.appendChild(h1);
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