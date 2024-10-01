showTime();
showTemp();

function showTime() {
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";

    if (h == 0) {
        h = 12;
    }

    if (h > 12) {
        h = h - 12;
        session = "PM";
    }

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m;// + ":" + s + " " + session;
    document.getElementById("MyClock").innerText = time;
    document.getElementById("MyClock").textContent = time;

    setTimeout(showTime, 1000);

}

function showTemp() {
    var WeatherEndpoint = 'https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1&models=dmi_seamless';

    fetch(WeatherEndpoint)
    .then(response => response.json())
    .then(data => weatherData(data))
    .catch(error => console.error('Error:', error));

    function weatherData(payload){
        var maxtemp = payload.daily.temperature_2m_max;
        document.getElementById("MaxTemp").textContent = payload.daily.temperature_2m_max;
        document.getElementById("MinTemp").textContent = payload.daily.temperature_2m_min;
        
    }
}