function fetchRaceResults() {
    fetch(
        "https://ergast.com/api/f1/current/last/results.json"
    )
        .then((response) => response.json())
        .then((data) => {

            const race = data.MRData.RaceTable.Races[0];
            const results = race.Results;

            const tableBody = document.getElementById("race-results-body");

            results.forEach((result) => {
                const row = document.createElement("tr");
                row.innerHTML = `
            <td>${result.position}</td>
            <td>${result.Driver.givenName} ${result.Driver.familyName}</span></td>
            <td>${result.Constructor.name}</td>
            <td>${result.Time ? result.Time.time : result.status}</td>
          `;
                tableBody.appendChild(row);
            });

            const latitude = race.Circuit.Location.lat;
            const longitude = race.Circuit.Location.long; // Corrected property name to extract longitude
            const raceHeader = document.getElementById("race-header");

            // Convert the date to Unix time format (UTC)
            const raceDate = new Date(race.date);
            const unixTime = raceDate.getTime() / 1000;

            fetchWeatherData(latitude, longitude, unixTime);
        });
}

function fetchWeatherData(latitude, longitude, unixTime) {
    const apiKey = "92b1428d50f205626792593c7baddab5";
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${unixTime}&appid=${apiKey}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log("Weather Data:", data);

            const weatherData = data.data[0];

            // Convert temperature from Kelvin to Fahrenheit
            const temperatureFahrenheit = (weatherData.temp - 273.15) * 9 / 5 + 32;

            const weatherInfo = `
          <p>Weather: ${weatherData.weather[0].main}</p>
          <p>Temperature: ${temperatureFahrenheit.toFixed(2)} °F</p>
          <p>Humidity: ${weatherData.humidity} %</p>
        `;

            const raceHeader = document.getElementById("race-header");
            raceHeader.innerHTML += weatherInfo;
        });
}



window.onload = fetchRaceResults;
