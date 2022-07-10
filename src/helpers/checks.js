export const tempCheck = (weather) => {
  if (weather !== "") {
    let temp = Math.round(weather.main.temp);
    let finalText = temp + "°";
    return finalText;
  }
};

export const situationCheck = (weather) => {
  if (weather !== "") {
    let situation = weather.weather[0].main;
    return (
      <div className="situation">
        <h3>{situation}</h3>
      </div>
    );
  }
};

export const locationCheck = (weather) => {
  if (weather !== "") {
    let location = weather.name

    return location;
  }
};
