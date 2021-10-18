import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState('')
  const didMountRef = useRef(false)

  useEffect(() => {
    const findCountry = async() => {
      try {
        const response = await axios
          .get(`https://restcountries.eu/rest/v2/name/${name}?fullText=true`)
          setCountry(response.data[0])
      } catch {
        console.log('Country not found in database')
        setCountry({name: null})
      }
    }

    if(didMountRef.current) findCountry()
    else didMountRef.current = true
  }, [name])

  return country
}

const Country = ({ country }) => {
  
  if (!country) {
    return null
  }

  if (!country.name) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.name} </h3>
      <div>capital {country.capital} </div>
      <div>population {country.population}</div> 
      <img src={country.flag} height='100' alt={`flag of ${country.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  let country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }
  
  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App
