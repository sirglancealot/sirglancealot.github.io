showTime();
forecastData();

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
function forecastData() {
    var WeatherEndpoint = 'https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1&models=dmi_seamless';
    var NewEndpoint = 'https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&minutely_15=temperature_2m,relative_humidity_2m,apparent_temperature,rain,snowfall,weather_code,wind_speed_10m,lightning_potential,is_day&hourly=temperature_2m,rain,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless';
    fetch(NewEndpoint)
    .then(response => response.json())
    .then(data => weatherData(data))
    .catch(error => console.error('Error:', error));

    function weatherData(payload){
        var DailyUnits = payload.daily_units;
        var HourlyUnits = payload.hourly_units;
        var MaxTemp = payload.daily.temperature_2m_max + ' ' + DailyUnits.temperature_2m_max;
        var MinTemp = payload.daily.temperature_2m_min + ' ' + DailyUnits.temperature_2m_min;
        var MinToMaxTemp = payload.daily.temperature_2m_min[0] + ' - ' + payload.daily.temperature_2m_max[0] + ' ' + DailyUnits.temperature_2m_min;
        var ForecastTemp = payload.hourly.temperature_2m;
        var Time = payload.hourly.time;
        var CurrentDataTime  = payload.minutely_15.time;
        var CurrentDataTemp = payload.minutely_15.temperature_2m;
        var ForecastArray = []
        ForecastArray = GetForecastDataArray(Time,ForecastTemp);
        
        var ActualCurrentHour = GetCurrentHour();
        var ActualCurrentQuarterHour = GetCurrentQuarterHour();
        CurrentWeatherArray = GetForecastDataArray(CurrentDataTime,CurrentDataTemp);
        
        var NextCurrentTemp = GetNextForecastItem(CurrentWeatherArray,ActualCurrentQuarterHour).Temperature + ' ' + minutely_15_units.temperature_2m;
        var NextTemp = GetNextForecastItem(ForecastArray,ActualCurrentHour).Temperature + ' ' + HourlyUnits.temperature_2m;
        //document.getElementById("MaxTemp").textContent = MaxTemp;
        //document.getElementById("MinTemp").textContent = MinTemp;
        document.getElementById("MinToMaxTemp").textContent = MinToMaxTemp;
        document.getElementById("NextCurrentTemp").textContent = NextCurrentTemp;
        
        setTimeout(forecastData, 1800000); // 30 minutes
    }
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

function GetNextForecastItem(ForecastArr,Timeslot) {
    var CurrentHour = GetCurrentHour();
    var CurrentData = ForecastArr.find((item) => item.Hour == CurrentHour);
    return CurrentData;
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
}

function GetCurrentQuarterHour(){
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate());
    var dd = targetDate.getDate();
    var mm = targetDate.getMonth() + 1;
    var yyyy = targetDate.getFullYear();
    var hh = targetDate.getHours();
    var m = targetDate.getMinutes();
    var min;
    if (m >= 0 && m < 15) {
        min = '00';
    } else if (m >= 15 && m < 30) {
        min = '15';
    } else if (m >= 30 && m < 45) {
        min = '30';
    } else if (m >= 45 && m <= 59) {
        min = '45';
    } 
    var dateCurrent = yyyy +'-'+ leadingZero(mm) + "-" + leadingZero(dd) + "T" + leadingZero(hh) +':'+min;
    
    return dateCurrent;

    function leadingZero(value) {
    if (value < 10) {
        return "0" + value.toString();
    }
        return value.toString();
    }
}

function GetWMOCodes(){
    function forecastData() {
    var file = 'WMOWeatherInterpretationCodes.json';
    fetch(file)
    .then(response => response.json())
    .then(data => formatWMOdata(data))
    .catch(error => console.error('Error:', error));
    }

    function formatWMOdata(wmoPayload){
        return wmoPayload;
    }
}
