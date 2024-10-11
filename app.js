showTime();
GetCurrentData();
GetDailyForecastData()

function showTime() {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  var session = "AM";
  var dd = date.getDate();
  var mm = date.getMonth();
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

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

  //var time = h + ":" + m + ":" + s + " " + session;
  var time = RemoveLeadingZero(h) + ":" + m;
  var DateMonth = dd + ' ' +monthNames[mm] +'.';
  document.getElementById("MyClock").innerText = time;
  document.getElementById("MyClock").textContent = time;
  document.getElementById("MyClockSession").textContent = session;
  document.getElementById("DateMonth").textContent = DateMonth;

  setTimeout(showTime, 1000);
}

function GetCurrentData() {
  var BrowserLatitude;
  var BrowserLongitude;
   
  getPosition()
  .then((position) => {
    console.log(position);
    BrowserLatitude = position.coords.latitude;
    BrowserLongitude = position.coords.longitude;
  
    var WeatherEndpoint = "https://api.open-meteo.com/v1/forecast?latitude=" + BrowserLatitude + "&longitude=" + BrowserLongitude + "&minutely_15=temperature_2m,relative_humidity_2m,apparent_temperature,rain,snowfall,weather_code,wind_speed_10m,lightning_potential,is_day&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless";
    //var WeatherEndpoint = "https://api.open-meteo.com/v1/forecast?latitude=" + BrowserLatitude + "&longitude=" + BrowserLongitude + "&minutely_15=temperature_2m,relative_humidity_2m,apparent_temperature,rain,snowfall,weather_code,wind_speed_10m,lightning_potential,is_day&hourly=temperature_2m,rain,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless";
    console.log(WeatherEndpoint);
    fetch(WeatherEndpoint)
      .then((response) => response.json())
      .then((data) => weatherData(data))
      .catch((error) => console.error("Error:", error));

    function weatherData(payload) {

      // Setting units for the current vaules (Minutely)
      var MinutelyUnits = payload.minutely_15_units;

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

      // Setting final variables for web, for current data
      var WebCurrentData = GetNextForecastMinutelyItem(MinutelyWeatherArr, ActualCurrentQuarterHour);
      console.log('Time: '+WebCurrentData.Hour+' \n Temperature: '+WebCurrentData.Temperature+' \n Humidity: '+WebCurrentData.Humidity+' \n ApparentTemperature: '+WebCurrentData.ApparentTemperature+' \n Rain: '+WebCurrentData.Rain+' \n Snowfall: '+WebCurrentData.Snowfall+' \n WeatherCode: '+WebCurrentData.WeatherCode.Code+' \n WindSpeed: '+WebCurrentData.WindSpeed+' \n LightningPotential: '+WebCurrentData.LightningPotential+' \n IsDay: '+WebCurrentData.IsDay);

      var WebCurrentTemp = WebCurrentData.Temperature + "" + MinutelyUnits.temperature_2m;
      var WebCurrentHumidity = WebCurrentData.Humidity + "" + MinutelyUnits.relative_humidity_2m;
      var WebCurrentApparentTemperature = WebCurrentData.ApparentTemperature + "" + MinutelyUnits.apparent_temperature;
      var WebCurrentRain = WebCurrentData.Rain + "" + MinutelyUnits.rain;
      var WebCurrentSnowfall = WebCurrentData.Snowfall + "" + MinutelyUnits.snowfall;
      var WebCurrentWindSpeed = getWindDescription(WebCurrentData.WindSpeed).daDK +' ('+(WebCurrentData.WindSpeed / 3,6) + 'm/s)';// + MinutelyUnits.wind_speed_10m+ ')';

      var CurrentWeatherCodeObj = GetWMOCodes(WebCurrentData.WeatherCode.Code);
      var WebCurrentWeather = CurrentWeatherCodeObj.daDK +', '+ WebCurrentTemp;
      var WebCurrentWeatherIcon = CurrentWeatherCodeObj.Image;
      var WebPosition = 'Browser position, latitude: '+ BrowserLatitude +' longitude: '+BrowserLongitude;
      var WebPositionLink = '<a href="https://maps.google.com/?q='+BrowserLatitude+','+BrowserLongitude+' "target="_blank">Browser position, lat: '+ BrowserLatitude.toString().substring(0,6) +' long: '+BrowserLongitude.toString().substring(0,6)+'</a>';
      
      // Mapping values to elements
      //document.getElementById("WebCurrentTemp").textContent = WebCurrentTemp;
      //document.getElementById("WebCurrentSnowfall").textContent = WebCurrentSnowfall;
      document.getElementById("WebCurrentHumidity").textContent = WebCurrentHumidity;
      document.getElementById("WebCurrentRain").textContent = WebCurrentRain;
      document.getElementById("WebCurrentApparentTemperature").textContent = WebCurrentApparentTemperature;
      document.getElementById("WebCurrentWindSpeed").textContent = WebCurrentWindSpeed;
      document.getElementById("WebCurrentWeather").textContent = WebCurrentWeather;
      document.getElementById("WebCurrentWeatherIcon").src = WebCurrentWeatherIcon; 
      document.getElementById("WebPositionLink").innerHTML = WebPositionLink
      
      // Set update freq
      setTimeout(GetCurrentData, 900000); // 15 minutes
    }
  })
  .catch((err) => {
    console.error(err.message);
  });
}

function GetDailyForecastData() {
  var BrowserLatitude;
  var BrowserLongitude;

  getPosition()
  .then((position) => {
    console.log(position);
    BrowserLatitude = position.coords.latitude;
    BrowserLongitude = position.coords.longitude;
  
    var WeatherEndpoint = "https://api.open-meteo.com/v1/forecast?latitude=" + BrowserLatitude + "&longitude=" + BrowserLongitude + "&daily=weather_code,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless";
    console.log(WeatherEndpoint);
    
    // Endpoint fixed to Skive
    // https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&daily=weather_code,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless

    fetch(WeatherEndpoint)
      .then((response) => response.json())
      .then((data) => weatherData(data))
      .catch((error) => console.error("Error:", error));

    function weatherData(payload) {

      // Setting units for Daily values
      var DailyUnits = payload.daily_units;
      
      // Setting variables for web from daily payload
      var DailyDataObj = payload.daily;
      var WebMinToMaxTemp = DailyDataObj.temperature_2m_min[0] + " - " + DailyDataObj.temperature_2m_max[0] + DailyUnits.temperature_2m_min;
      var WebDailyWeatherCode = GetWMOCodes(DailyDataObj.weather_code[0]).daDK +', '+ WebMinToMaxTemp;
      var WebDailyRainSum = DailyDataObj.rain_sum[0] + DailyUnits.rain_sum;
      var WebDailyWindSpeed = (DailyDataObj.wind_speed_10m_max[0] / 3,6) + 'm/s';//DailyUnits.wind_speed_10m_max;
      var WebDailyWindGusts = (DailyDataObj.wind_gusts_10m_max[0] / 3,6) + 'm/s';//DailyUnits.wind_gusts_10m_max;
      var WebDailyDaylightDuration = (DailyDataObj.daylight_duration[0] / 3600).toString().substring(0,5) +'h';
      // Setting final variables for web, for daily data
      document.getElementById("WebDailyWeatherCode").textContent = WebDailyWeatherCode;
      document.getElementById("WebDailyRainSum").textContent = WebDailyRainSum;
      document.getElementById("WebDailyWindSpeed").textContent = WebDailyWindSpeed;
      document.getElementById("WebDailyWindGusts").textContent = WebDailyWindGusts;
      document.getElementById("WebDailyDaylightDuration").textContent = WebDailyDaylightDuration;
      
      // Set update freq
      setTimeout(GetDailyForecastData, 3600000); // 60 minutes
    }
  })
  .catch((err) => {
    console.error(err.message);
  });
}

  // // Get location values from geolocation
  // var getPosition = function (options) {
  //   return new Promise(function (resolve, reject) {
  //     navigator.geolocation.getCurrentPosition(resolve, reject, options);
  //   });
  // }
  
// Get location values from geolocation
function getPosition (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
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

// Get an object in an array, defined by a timeslot
function GetNextForecastMinutelyItem(ForecastArr, Timeslot) {
  var CurrentQuarter = GetCurrentQuarterHour();
  var CurrentData = ForecastArr.find((item) => item.Hour == CurrentQuarter);
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

function RemoveLeadingZero(value) {
  var StringValue = value.toString();
  return StringValue.replace(/^0+(?=\d)/, '');
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
}
  function leadingZero(value) {
    if (value < 10) {
      return "0" + value.toString();
    }
    return value.toString();
}

// Setting WMO Weather interpretation codes (WW) for weather code
function GetWMOCodes(WeatherCode) {
    if (!WeatherCode && WeatherCode != 0) { 
      console.log('No weather code: '+WeatherCode) 
      return "";
    }
    var Codes = [
        { "Code": 0, "enUK": "Clear sky", "daDK": "Klart vejr", "Image":"./img/wmo0a.png" },
        { "Code": 1, "enUK": "Mainly clear", "daDK": "Mest klart vejr", "Image":"./img/wmo1a.png" },
        { "Code": 2, "enUK": "Partly cloudy", "daDK": "Delvist overskyet vejr", "Image":"./img/wmo2a.png" },
        { "Code": 3, "enUK": "Overcast", "daDK": "Overskyet", "Image":"./img/wmo3a.png" },
        { "Code": 45, "enUK": "Fog", "daDK": "Tåget", "Image":"./img/wmo45a.png" },
        { "Code": 48, "enUK": "Depositing rime fog", "daDK": "Rimtåge", "Image":"./img/wmo45a.png" },
        { "Code": 51, "enUK": "Drizzle: Light", "daDK": "Let støvregn", "Image":"./img/wmo51a.png" },
        { "Code": 53, "enUK": "Drizzle: Moderate", "daDK": "Moderat støvregn", "Image":"./img/wmo51a.png" },
        { "Code": 55, "enUK": "Drizzle: Dense intensity", "daDK": "Kraftig støvregn", "Image":"./img/wmo51a.png" },
        { "Code": 56, "enUK": "Freezing Drizzle: Light", "daDK": "Kold støvregn: Let", "Image":"./img/wmo56a.png" },
        { "Code": 57, "enUK": "Freezing Drizzle: Dense intensity", "daDK": "Kold støvregn: Kraftig intensitet", "Image":"./img/wmo56a.png" },
        { "Code": 61, "enUK": "Rain: Slight", "daDK": "Let regn", "Image":"./img/wmo61a.png" },
        { "Code": 63, "enUK": "Rain: Moderate", "daDK": "Moderat regn", "Image":"./img/wmo63a.png" },
        { "Code": 65, "enUK": "Rain: Heavy intensity", "daDK": "Kraftig regn", "Image":"./img/wmo63a.png" },
        { "Code": 66, "enUK": "Freezing Rain: Light", "daDK": "Let men kold regn", "Image":"./img/wmo66a.png" },
        { "Code": 67, "enUK": "Freezing Rain: Heavy intensity", "daDK": "Kraftig kold regn", "Image":"./img/wmo66a.png" },
        { "Code": 71, "enUK": "Snow fall: Slight", "daDK": "Let snefald", "Image":"./img/wmo71a.png" },
        { "Code": 73, "enUK": "Snow fall: Moderate", "daDK": "Moderat snefald", "Image":"./img/wmo73a.png" },
        { "Code": 75, "enUK": "Snow fall: Heavy intensity", "daDK": "Kraftig snefald", "Image":"./img/wmo73a.png" },
        { "Code": 77, "enUK": "Snow grains", "daDK": "Snefnug", "Image":"./img/wmo71a.png" },
        { "Code": 80, "enUK": "Rain showers: Slight", "daDK": "Lette regnbyger", "Image":"./img/wmo80a.png" },
        { "Code": 81, "enUK": "Rain showers: Moderate", "daDK": "Moderate regnbyger", "Image":"./img/wmo81a.png" },
        { "Code": 82, "enUK": "Rain showers: Violent", "daDK": "Kraftige regnbyger", "Image":"./img/wmo81a.png" },
        { "Code": 85, "enUK": "Snow showers: Slight", "daDK": "Lette snebyger", "Image":"./img/wmo85a.png" },
        { "Code": 86, "enUK": "Snow showers: Heavy", "daDK": "Kraftige snebyger", "Image":"./img/wmo86a.png" },
        { "Code": 95, "enUK": "Thunderstorm: Slight or moderate", "daDK": "Let eller moderat tordenvejr", "Image":"./img/wmo95a.png" },
        { "Code": 96, "enUK": "Thunderstorm with slight hail", "daDK": "Tordenvejr med let hagl", "Image":"./img/wmo95a.png" },
        { "Code": 99, "enUK": "Thunderstorm with heavy hail", "daDK": "Tordenvejr med kraftig hagl", "Image":"./img/wmo95a.png" }
        ];
    var WeatherCodeObj = Codes.find((item) => item.Code == WeatherCode);
    return WeatherCodeObj;
  }

function getWindDescription(speed) {
    if (speed > 117) return { daDK: "Orkan", enUK: "Hurricane" };
    if (speed >= 103 && speed <= 117) return { daDK: "Stærk storm", enUK: "Strong storm" };
    if (speed >= 89 && speed <= 102) return { daDK: "Storm", enUK: "Storm" };
    if (speed >= 75 && speed <= 88) return { daDK: "Stormende kuling", enUK: "Stormy gale" };
    if (speed >= 62 && speed <= 74) return { daDK: "Hård kuling", enUK: "Strong gale" };
    if (speed >= 50 && speed <= 61) return { daDK: "Stiv kuling", enUK: "Stiff gale" };
    if (speed >= 39 && speed <= 49) return { daDK: "Hård vind", enUK: "Strong wind" };
    if (speed >= 29 && speed <= 38) return { daDK: "Frisk vind", enUK: "Fresh wind" };
    if (speed >= 20 && speed <= 28) return { daDK: "Jævn vind", enUK: "Steady wind" };
    if (speed >= 12 && speed <= 19) return { daDK: "Let vind", enUK: "Gentle breeze" };
    if (speed >= 6 && speed <= 11) return { daDK: "Svag vind", enUK: "Light breeze" };
    if (speed >= 1 && speed <= 5) return { daDK: "Næsten stille", enUK: "Almost silent" };
    return { daDK: "Stille", enUK: "Quiet" };
}

  // COMMENTED OUT - CURRENTLY NOT IN USE - CAN BE USED FOR HOURLY DATA
// Generate object array combined with a timestamp and a value
// function GetForecastDataArray(TimeArr, TempArr) {
//   var ForecastArr = [];
//   var map;
//   for (let i = 0; i < TimeArr.length; i++) {
//     map = {
//       Hour: TimeArr[i],
//       Temperature: TempArr[i],
//     };
//     ForecastArr.push(map);
//   }
//   return ForecastArr;
// }