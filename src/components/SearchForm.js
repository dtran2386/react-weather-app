import React from 'react'

function SearchForm({ onClickHandler, selectedCity, setSelectedCity, selectedState, setSelectedState }) {
  return (
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
  )
}

export default SearchForm