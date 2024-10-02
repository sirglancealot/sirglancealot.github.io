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
    var WeatherEndpoint = 'https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1&models=dmi_seamless';

    fetch(WeatherEndpoint)
    .then(response => response.json())
    .then(data => weatherData(data))
    .catch(error => console.error('Error:', error));

    function weatherData(payload){
        var DailyUnits = payload.daily_units;
        var HourlyUnits = payload.hourly_units;
        var MaxTemp = payload.daily.temperature_2m_max + ' ' + DailyUnits.temperature_2m_max;
        var MinTemp = payload.daily.temperature_2m_min + ' ' + DailyUnits.temperature_2m_min;
        var ForecastTemp = payload.hourly.temperature_2m;
        var Time = payload.hourly.time;
        var NextTemp = ForecastArray.find(GetNextForecastItem).Temperature + ' ' + HourlyUnits.temperature_2m;
        var ForecastArray = []
        ForecastArray = GetForecastDataArray(Time,ForecastTemp);
        var CurrentHour = GetCurrentHour();
        
        document.getElementById("MaxTemp").textContent = MaxTemp;
        document.getElementById("MinTemp").textContent = MinTemp;
        document.getElementById("NextTemp").textContent = NextTemp;
        
        //setTimeout(showTemp, 600000); // 10 minutes
    }
    
    function GetForecastDataArray(TimeArr,TempArr){
        var ForecastArr = [];    
        var map;
        for(let i = 0; i < TimeArr.length; i++){
            map = {
                Hour: TimeArr[i],
                Temperature: TempArr[i]
            };
            ForecastArr.push(map);
        }
        return ForecastArr;
    };

    function GetNextForecastItem(ForecastArr) {
        return ForecastArr.Hour = GetCurrentHour();
    }

    function GetCurrentHour(){
        var targetDate = new Date();
        targetDate.setDate(targetDate.getDate());
        var dd = targetDate.getDate();
        var mm = targetDate.getMonth() + 1;
        var yyyy = targetDate.getFullYear();
        var hh = targetDate.getHours();
        var dateCurrent = yyyy +'-'+ leadingZero(mm) + "-" + leadingZero(dd) + "T" + leadingZero(hh) +':00';
        
        return dateCurrent;

        function leadingZero(value) {
        if (value < 10) {
            return "0" + value.toString();
        }
            return value.toString();
        }
    };
}
