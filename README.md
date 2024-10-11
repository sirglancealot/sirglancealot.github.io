# sirglancealot.github.io
This is a project for the purpose of learning javascript, css and html. 

# Data from: https://open-meteo.com
More details: 

Current
https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&minutely_15=temperature_2m,relative_humidity_2m,apparent_temperature,rain,snowfall,weather_code,wind_speed_10m,lightning_potential,is_day&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless

Daily
https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&daily=weather_code,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless

Auto timezone for daily:
https://api.open-meteo.com/v1/forecast?latitude=56.567&longitude=9.0271&daily=weather_code,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto&forecast_days=3&models=dmi_seamless

Docs for daily:
https://open-meteo.com/en/docs#latitude=56.567&longitude=9.0271&current=&minutely_15=&hourly=&daily=weather_code,temperature_2m_max,temperature_2m_min,daylight_duration,sunshine_duration,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=Europe%2FBerlin&forecast_days=3&models=dmi_seamless
