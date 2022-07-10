import axios from "axios";
import { useState, useEffect } from "react";
import moment from 'moment-timezone'
import "./App.css";
import SearchForm from './components/SearchForm'
import { tempCheck, situationCheck, locationCheck } from './helpers/checks'

const api = {
  key: process.env.REACT_APP_API_KEY,
  base: process.env.REACT_APP_API_BASE_URL,
};

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [weather, setWeather] = useState("");
  const [forecast, setForecast] = useState([])

  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus(null);
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
      },
      () => {
        setStatus("Unable to retrieve your location");
      }
    );
  }, []);

  const onClickHandler = async (e) => {
    e.preventDefault();

    try {
      if (selectedCity && selectedState) {
        await axios
          .get(
            `${api.base}weather?q=${selectedCity},${selectedState},USA&units=imperial&appid=${api.key}`
          )
          .then((result) => {
            setWeather(result.data);
            setSelectedCity("");
            setSelectedState("");
          });
        await axios
          .get(
            `${api.base}forecast?q=${selectedCity},${selectedState},USA&units=imperial&appid=${api.key}`
          )
          .then((result) => {
            setForecast(result.data.list)
          });
      }
    } catch (error) {
      console.error(error.response);
      if (error.response.status === 404) {
        alert("Please double check your spelling!");
      }
    }
  };

  const getLocation = async () => {
    if (!navigator.geolocation)
      setStatus("Geolocation is not supported by your browser");

    setStatus("Locating...");

    await axios
      .get(
        `${api.base}weather?lat=${lat}&lon=${lng}&units=imperial&appid=${api.key}`
      )
      .then((result) => {
        setWeather(result.data);
      });

    await axios
      .get(
        `${api.base}forecast?lat=${lat}&lon=${lng}&units=imperial&appid=${api.key}`
      )
      .then((result) => {
        setForecast(result.data.list)
      });
    <div>{status}</div>;
  };

  return (
    <div
      className={
        typeof weather.main != "undefined"
          ? weather.main.temp > 12
            ? "container warm"
            : "container"
          : "container"
      }
    >
      <div
        className={
          typeof weather.main != "undefined"
            ? weather.main.temp > 12
              ? "app warm"
              : "app"
            : "app"
        }
      >
        <main>
          <div className="top">
            <div className="location">{locationCheck(weather)}</div>
            <div>
              <div className="temp">
                <h2>{tempCheck(weather)}</h2>
              </div>
              {situationCheck(weather)}
            </div>
          </div>
          <div className="card-container">
            {forecast.slice(0,5).map(item => (
              <div key={item.dt} className="card">
                {/* {item.dt_txt} <br/><br/> */}
                {moment(item.dt_txt).tz('America/New_York').format('MMMM Do YYYY h:mm:ss a')} <br/><br/>
                {<h1>{`${item.main.temp}°`}</h1>}<br/><br/>
                {item.weather[0].description}
                {<img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="weather icon" />}
              </div>
            ))}
          </div>
          <div className="App">
            <button className="btn" onClick={getLocation}>
              Use your Location
            </button>
          </div>
          <SearchForm onClickHandler={onClickHandler} selectedCity={selectedCity} selectedState={selectedState} setSelectedCity={setSelectedCity} setSelectedState={setSelectedState} />
        </main>
      </div>
    </div>
  );
}

export default App;
