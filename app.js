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

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  var time = h + ":" + m; // + ":" + s + " " + session;
  document.getElementById("MyClock").innerText = time;
  document.getElementById("MyClock").textContent = time;

  setTimeout(showTime, 1000);
}
function forecastData() {
  var WeatherEndpoint =
    "https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1&models=dmi_seamless";
  var NewEndpoint =
    "https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&minutely_15=temperature_2m,relative_humidity_2m,apparent_temperature,rain,snowfall,weather_code,wind_speed_10m,lightning_potential,is_day&hourly=temperature_2m,rain,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless";
  fetch(NewEndpoint)
    .then((response) => response.json())
    .then((data) => weatherData(data))
    .catch((error) => console.error("Error:", error));

  function weatherData(payload) {
    // Setting units for the various groupings: Daily, Hourly, Minutely
    var DailyUnits = payload.daily_units;
    var HourlyUnits = payload.hourly_units;
    var MinutelyUnits = payload.minutely_15_units;

    // Setting Min and max from daily payload
    var MaxTemp =
      payload.daily.temperature_2m_max + " " + DailyUnits.temperature_2m_max;
    var MinTemp =
      payload.daily.temperature_2m_min + " " + DailyUnits.temperature_2m_min;
    var MinToMaxTemp =
      payload.daily.temperature_2m_min[0] +
      " - " +
      payload.daily.temperature_2m_max[0] +
      " " +
      DailyUnits.temperature_2m_min;

    // Setting arrays and other variables for hourly temperatures
    var ForecastTemp = payload.hourly.temperature_2m;
    var Time = payload.hourly.time;
    var ForecastArray = [];
    ForecastArray = GetForecastDataArray(Time, ForecastTemp);
    var ActualCurrentHour = GetCurrentHour();
    var NextTemp =
      GetNextForecastItem(ForecastArray, ActualCurrentHour).Temperature +
      " " +
      HourlyUnits.temperature_2m;

    // Setting arrays and other variables for mitutely temperatures
    var ActualCurrentQuarterHour = GetCurrentQuarterHour();
    var CurrentDataTime = payload.minutely_15.time;
    var CurrentDataTemp = payload.minutely_15.temperature_2m;
    var minutelyTime = payload.minutely_15.time;
    var minutelyTemperature = payload.minutely_15.temperature_2m;
    var minutelyHumidity = payload.minutely_15.relative_humidity_2m;
    var minutelyApparentTemperature = payload.minutely_15.apparent_temperature;
    var minutelyRain = payload.minutely_15.rain;
    var minutelySnowfall = payload.minutely_15.snowfall;
    var minutelyWeatherCode = payload.minutely_15.weather_code;
    var minutelyWindSpeed = payload.minutely_15.wind_speed_10m;
    var minutelyLightningPotential = payload.minutely_15.lightning_potential;
    var minutelyIsDay = payload.minutely_15.is_day;

    var MinutelyWeatherArr = GetMinutelyWeatherIntoArray(
      minutelyTime,
      minutelyTemperature,
      minutelyHumidity,
      minutelyApparentTemperature,
      minutelyRain,
      minutelySnowfall,
      minutelyWeatherCode,
      minutelyWindSpeed,
      minutelyLightningPotential,
      minutelyIsDay
    );
    var WebWeatherCode = GetNextForecastItem(
      MinutelyWeatherArr,
      ActualCurrentQuarterHour
    ).WeatherCode;
    // Getting forecast and current weather data
    var CurrentWeatherArray = [];

    CurrentWeatherArray = GetForecastDataArray(
      CurrentDataTime,
      CurrentDataTemp
    );
    var NextCurrentTemp =
      GetNextForecastItem(CurrentWeatherArray, ActualCurrentQuarterHour)
        .Temperature +
      " " +
      MinutelyUnits.temperature_2m;

    // Mapping values to elementss
    //document.getElementById("MaxTemp").textContent = MaxTemp;
    //document.getElementById("MinTemp").textContent = MinTemp;
    document.getElementById("MinToMaxTemp").textContent = MinToMaxTemp;
    document.getElementById("NextCurrentTemp").textContent = NextCurrentTemp;
    document.getElementById("WebWeatherCode").textContent = WebWeatherCode;

    // Set update freq
    setTimeout(forecastData, 1800000); // 30 minutes
  }
}

// Generate object array combined with a timestamp and a value
function GetForecastDataArray(TimeArr, TempArr) {
  var ForecastArr = [];
  var map;
  for (let i = 0; i < TimeArr.length; i++) {
    map = {
      Hour: TimeArr[i],
      Temperature: TempArr[i],
    };
    ForecastArr.push(map);
  }
  return ForecastArr;
}

// Generate array for current weather (minutely): time, temperature_2m, relative_humidity_2m, apparent_temperature, rain, snowfall, weather_code, wind_speed_10m, lightning_potential, is_day

function GetMinutelyWeatherIntoArray(
  Time,
  Temperature,
  Humidity,
  ApparentTemperature,
  Rain,
  Snowfall,
  WeatherCode,
  WindSpeed,
  LightningPotential,
  IsDay
) {
  var MinutelyArr = [];
  var map;
  for (let i = 0; i < Time.length; i++) {
    map = {
      Hour: Time[i],
      Temperature: Temperature[i],
      Humidity: Humidity[i],
      ApparentTemperature: ApparentTemperature[i],
      Rain: Rain[i],
      Snowfall: Snowfall[i],
      WeatherCode: GetWMOCodes(WeatherCode[i]),
      WindSpeed: WindSpeed[i],
      LightningPotential: LightningPotential[i],
      IsDay: IsDay[i],
    };
    MinutelyArr.push(map);
  }
  return MinutelyArr;
}

// Get an object in an array, defined by a timeslot
function GetNextForecastItem(ForecastArr, Timeslot) {
  var CurrentHour = GetCurrentHour();
  var CurrentData = ForecastArr.find((item) => item.Hour == CurrentHour);
  return CurrentData;
}

// Get current hour in format: 2024-10-04T11:00
function GetCurrentHour() {
  var targetDate = new Date();
  targetDate.setDate(targetDate.getDate());
  var dd = targetDate.getDate();
  var mm = targetDate.getMonth() + 1;
  var yyyy = targetDate.getFullYear();
  var hh = targetDate.getHours();
  var dateCurrent =
    yyyy +
    "-" +
    leadingZero(mm) +
    "-" +
    leadingZero(dd) +
    "T" +
    leadingZero(hh) +
    ":00";

  return dateCurrent;

  function leadingZero(value) {
    if (value < 10) {
      return "0" + value.toString();
    }
    return value.toString();
  }
}

// Get current hour and quarter in format: 2024-10-04T11:15 (:00, :15, :30, :45)
function GetCurrentQuarterHour() {
  var targetDate = new Date();
  targetDate.setDate(targetDate.getDate());
  var dd = targetDate.getDate();
  var mm = targetDate.getMonth() + 1;
  var yyyy = targetDate.getFullYear();
  var hh = targetDate.getHours();
  var m = targetDate.getMinutes();
  var min;
  if (m >= 0 && m < 15) {
    min = "00";
  } else if (m >= 15 && m < 30) {
    min = "15";
  } else if (m >= 30 && m < 45) {
    min = "30";
  } else if (m >= 45 && m <= 59) {
    min = "45";
  }
  var dateCurrent =
    yyyy +
    "-" +
    leadingZero(mm) +
    "-" +
    leadingZero(dd) +
    "T" +
    leadingZero(hh) +
    ":" +
    min;

  return dateCurrent;

  function leadingZero(value) {
    if (value < 10) {
      return "0" + value.toString();
    }
    return value.toString();
  }
}

// Setting WMO Weather interpretation codes (WW) for weather code
function GetWMOCodes(WeatherCode) {
  if (!WeatherCode && WeatherCode != 0) { 
    console.log('No weather code: '+WeatherCode) 
    return "";
  }

  Codes = { "WMOCodes": [
      { "Code": "0", "enUK": "Clear sky", "dkDK": "Klart vejr" },
      { "Code": "1", "enUK": "Mainly clear", "dkDK": "Mest klart vejr" },
      { "Code": "2", "enUK": "Partly cloudy", "dkDK": "Delvist overskyet vejr" },
      { "Code": "3", "enUK": "Overcast", "dkDK": "Overskyet" },
      { "Code": "45", "enUK": "Fog", "dkDK": "Tåget" },
      { "Code": "48", "enUK": "Depositing rime fog", "dkDK": "Rimtåge" },
      { "Code": "51", "enUK": "Drizzle: Light", "dkDK": "Let støvregn" },
      { "Code": "53", "enUK": "Drizzle: Moderate", "dkDK": "Moderat støvregn" },
      { "Code": "55", "enUK": "Drizzle: Dense intensity", "dkDK": "Kraftig støvregn" },
      { "Code": "56", "enUK": "Freezing Drizzle: Light", "dkDK": "Kold støvregn: Let" },
      { "Code": "57", "enUK": "Freezing Drizzle: Dense intensity", "dkDK": "Kold støvregn: Kraftig intensitet" },
      { "Code": "61", "enUK": "Rain: Slight", "dkDK": "Let regn" },
      { "Code": "63", "enUK": "Rain: Moderate", "dkDK": "Moderat regn" },
      { "Code": "65", "enUK": "Rain: Heavy intensity", "dkDK": "Kraftig regn" },
      { "Code": "66", "enUK": "Freezing Rain: Light", "dkDK": "Let men kold regn" },
      { "Code": "67", "enUK": "Freezing Rain: Heavy intensity", "dkDK": "Kraftig kold regn" },
      { "Code": "71", "enUK": "Snow fall: Slight", "dkDK": "Let snefald" },
      { "Code": "73", "enUK": "Snow fall: Moderate", "dkDK": "Moderat snefald" },
      { "Code": "75", "enUK": "Snow fall: Heavy intensity", "dkDK": "Kraftig snefald" },
      { "Code": "77", "enUK": "Snow grains", "dkDK": "Snefnug" },
      { "Code": "80", "enUK": "Rain showers: Slight", "dkDK": "Lette regnbyger" },
      { "Code": "81", "enUK": "Rain showers: Moderate", "dkDK": "Moderate regnbyger" },
      { "Code": "82", "enUK": "Rain showers: Violent", "dkDK": "Kraftige regnbyger" },
      { "Code": "85", "enUK": "Snow showers: Slight", "dkDK": "Lette snebyger" },
      { "Code": "86", "enUK": "Snow showers: Heavy", "dkDK": "Kraftige snebyger" },
      { "Code": "95", "enUK": "Thunderstorm: Slight or moderate", "dkDK": "Let eller moderat tordenvejr" },
      { "Code": "96", "enUK": "Thunderstorm with slight hail", "dkDK": "Tordenvejr med let hagl" },
      { "Code": "99", "enUK": "Thunderstorm with heavy hail", "dkDK": "Tordenvejr med kraftig hagl" }
    ]
  };
  var WeatherCodePhrase = Codes.WMOCodes.find((item) => (item.Code = WeatherCode));
  console.log('WeatherCode: '+WeatherCode + ' Weathercodeitem phrase: '+ WeatherCodePhrase.daDK);
  return WeatherCodePhrase.daDK;
}
