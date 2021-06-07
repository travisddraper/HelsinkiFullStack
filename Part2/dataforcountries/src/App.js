import './App.css';
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Country from './Country'


function App() {
  const [countries, setCountries ] = useState([])
  const [ value, setValue ] = useState('')

  useEffect(()=> {
    axios
    .get('https://restcountries.eu/rest/v2/all')
    .then(response => {
      setCountries(response.data);
    })
  }, [])

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const countryDisplay = value 
  ? countries.filter(country => country.name.toLowerCase().includes(value.toLowerCase()))
  : [];

  return (
    <div>
      find countries <input value={value} onChange={handleChange} />
      <Country countries={countryDisplay} />
    </div>
  );
}

export default App;
