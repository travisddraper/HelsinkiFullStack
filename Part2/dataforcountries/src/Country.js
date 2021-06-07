import axios from 'axios';
import React, {useState, useEffect} from 'react'

//Added this slugify in order to translate capital cities with diacritics to regular ascii characters to avoid breaking the axios.get request
const slugify = str => {
    const map = {
      '-' : ' ',
      '-' : '_',
      'a' : 'á|à|ã|â|ä|À|Á|Ã|Â|Ä|å',
      'e' : 'é|è|ê|ë|É|È|Ê|Ë',
      'i' : 'í|ì|î|ï|Í|Ì|Î|Ï',
      'o' : 'ó|ò|ô|õ|ö|Ó|Ò|Ô|Õ|Ö',
      'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      'c' : 'ç|Ç',
      'n' : 'ñ|Ñ'
    };
  
    for (var pattern in map) {
      str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    }
  
    return str;
}


const Language = ({name}) => (<li>{name}</li>)

const Infographic = ({country}) => (
    <div>
        <p>capital {country.capital}</p>
        <p>population {country.population}</p>
        <img src={country.flag} />
    </div>
)

const Weather = ({weather, icon}) => {

    return (
        <div>
        <p><b>Temperature:</b> {weather.temperature}</p>
        <img src={icon} />
        <p><b>Wind</b> {weather.wind_speed}</p>
    </div>
    )
}

function FullDisplay({country}) {
    const [weather, setWeather ] = useState([]);
    const [icon, setIcon ] = useState('');

    useEffect(()=> {
        const api_key = process.env.REACT_APP_API_KEY;
        const capital = slugify(country.capital);
        
        axios
        .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`)
        .then(response => {
            setWeather(response.data.current);
            setIcon(response.data.current.weather_icons[0])
        })
    }, [])
    
    return (
        <div>
            <h2>{country.name}</h2>
            <Infographic country={country} />
            <h3>languages</h3>
            <ul>
                {country.languages.map(language => ( <Language key={language.name} name={language.name} />))}
            </ul>
            <h3>Weather in {country.name}</h3>
            <Weather weather={weather} icon={icon} />
        </div>
    )
}

const SmallDisplay = ({country}) => {
    const [display, setDisplay] = useState(false);

    const handleClick = (e) => {
        setDisplay(!display)
        e.target.innerText = display ? 'Show' : 'Hide'
    }

    return (
        <div>
            {display 
                ? <FullDisplay country={country} />
                : <span>{country.name}</span>
            }
            <button onClick={handleClick}>Show</button>
        </div>
    )
}

function Country({countries}) {

    return (
        <div>
        {countries.length > 10
            ? <p>Too many results. Please narrow search.</p>
            : countries.map(country => {
                if(countries.length === 1) {
                    return <FullDisplay key={country.name} country={country} />
                }
                return <SmallDisplay key={country.name} country={country} />
                })
        }
        </div>
    )
}

export default Country