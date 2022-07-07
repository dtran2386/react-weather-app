import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";

const api = {
  key: process.env.REACT_APP_API_KEY,
  base: process.env.REACT_APP_API_BASE_URL,
};

function App() {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [weather, setWeather] = useState("");

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
            console.log(result.data);

            setWeather(result.data);
            setSelectedCity("");
            setSelectedState("");
          });
      }
    } catch (error) {
      console.error(error.response);
      if (error.response.status === 404) {
        alert("Please double check your spelling!");
      }
    }
  };

  const tempCheck = () => {
    if (weather !== "") {
      let temp = Math.round(weather.main.temp);
      let finalText = temp + "°";
      return finalText;
    }
  };

  const situationCheck = () => {
    if (weather !== "") {
      let situation = weather.weather[0].main;
      return (
        <div className="situation">
          <h3>{situation}</h3>
        </div>
      );
    }
  };

  const locationCheck = () => {
    if (weather !== "") {
      let location = weather.name.split(" ").slice(0);
      return location;
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
            <div className="location">{locationCheck()}</div>
            <div>
              <div className="temp">
                <h2>{tempCheck()}</h2>
              </div>
              {situationCheck()}
            </div>
          </div>
          <div className="App">
            <button className="btn" onClick={getLocation}>
              Use your Location
            </button>
          </div>
          <div className="select-area">
            <form onSubmit={onClickHandler}>
              <input
                type="text"
                value={selectedCity}
                placeholder="Please enter a US city name"
                onChange={(e) => setSelectedCity(e.target.value)}
              />
              <br />
              <input
                type="text"
                value={selectedState}
                placeholder="Please enter a US state name (abbreviation)"
                onChange={(e) => setSelectedState(e.target.value)}
              />
              <br />
              <br />
              <button className="btn">Submit</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
