import { useState,useEffect } from 'react'
import './App.css'
import searchIcon from "./assets/search.png"
import sunIcon from "./assets/sun.png"
import snowIcon from "./assets/snow.png"
import humidityIcon from "./assets/humidity.png"
import windIcon from "./assets/wind.png"
import drizzleIcon from "./assets/drizzle.png"
import rainyIcon from "./assets/rainy.png"
import cloudIcon from "./assets/cloud.png"

const  WeatherDetails=({icon,temp,city,country,lat,lon,humidity,wind}) =>{
  return(
    <>
    <div className="image">
      <img src={icon} alt ="weather image"></img>
    </div>

    <div className="temperature">{temp}°C</div>
    <div className="city-name">{city}</div>
    <div className="country-name">{country}</div>
    <div className="coordinates">
      <div>
      <span className="latitude">Latitude</span>
      <span>{lat}</span>
      </div>
      <div>
      <span className="longitude">Longitude</span>
      <span>{lon}</span>
      </div>
      </div>
      <div className="data-container">
        <div className="element">
          <img src={humidityIcon} alt="Humidity" className="icon"/>
        <div className="data">
          <div className="humidity-percent">{humidity}</div>
          <div className="text">Humidity</div>
        </div>
         </div>
        <div className="element">
          <img src={windIcon} alt="Wind" className="icon"/>
        <div className="data">
          <div className="wind-percent">{wind} km/hr</div>
          <div className="text">Wind Speed</div>
        </div>
        </div>
      </div>
     
    </>
  )
}


function App() {
   let apiKey="b1513b135845a57b5cfc66e461a02112"

  const [icon,setIcon]= useState(snowIcon)
  const [temp, setTemp]=useState('0°')
  const[city, setCity]=useState('')
  const[country, setCountry]=useState('')
  const[lon,setLon]=useState('0')
  const[lat,setLat]=useState('0')
  const[humidity,setHumidity]=useState('0')
  const[wind,setWind]=useState('0')
  const [text,setText]=useState('Madurai')
  const [cityNotFound, setCityNotFound]=useState(false)
  const[loading,setLoading]=useState(false)
  const[error,setError]=useState(null)

  const weatherIconMap={
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainyIcon,
    "09n": rainyIcon,
    "10d": rainyIcon,
    "10n": rainyIcon,
    "13d": snowIcon,
    "13n": snowIcon
  }

  const search= async()=>{
    setLoading(true)

    let URL=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=metric`
    
    try{
      let response=await fetch(URL)
      let data=await response.json()
      console.log(data)
      if(data.cod==="404"){
        console.error("city not found")
        setCityNotFound(true)
        setLoading(false)
        return
      }

      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setCity(data.name)
      setCountry(data.sys.country)
      setTemp(Math.floor(data.main.temp))
      setLon(data.coord.lon)
      setLat(data.coord.lat)
      const weatherIconCode= data.weather[0].icon
      setIcon(weatherIconMap[weatherIconCode] || sunIcon)
      setCityNotFound(false)
    }
    catch(error){
      console.error("An error has occurred:", error.message)
      setError("An error occurred while fetching error data")
    }
    finally{
      setLoading(false)
    }
  }

  const handleCity=(e)=>{
      setText(e.target.value)
  }

  const handleKeyDown=(e)=>{
    if(e.key==="Enter"){
      search()
    }
  }

  useEffect(()=>{
    search()
  },[])
  return (
    <>
      <div className="container">
         <div className= "input-container">
          <input type="search" className="cityInput" placeholder="Search City" 
          onChange={handleCity}
          onKeyDown={handleKeyDown}/>
          <div className="search-icon" onClick={()=>search()}>
              <img src={searchIcon} alt="search icon"/>
          </div>
         </div>
         
      

      { loading && <div className="loading-msg">Loading...</div>}
      { error && <div classname="error-msg">{error}</div>}
      { cityNotFound && <div className="city-not-found">city Not Found</div>}
     
      {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind} />}
      </div>
      </>

  )
}


export default App
