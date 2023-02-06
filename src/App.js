import logo from './logo.svg';
import './App.css';
import axios from "axios"
import { useState } from 'react';

import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  InfoBox,
} from "@react-google-maps/api"
const mapContainerStyle = {
  height: "500px",
  width: "100%",
}



function App() {
  const [placeLat, setplaceLat] = useState(1)
  const [placeLng, setplaceLng] = useState(1)
  const [temp, setTemp] = useState("")
  const [city, setCityName] = useState("")
  const [searchResult, setSearchResult] = useState(null)

  const onLoad = autocomplete => {
    setSearchResult(autocomplete)
    console.log("onLoad function", autocomplete)
  }
  const selectedPlace = (place) => {
    console.log("Parent Component place", place)
    if (place) {
      setplaceLat(place.lat)
      setplaceLng(place.lng)

    }

  }
  const onPlaceChanged = async () => {
    if (searchResult != "" && searchResult != null) {
      console.log("searchResult", searchResult)
      var place = await searchResult.getPlace()
      console.log(place)
      var lat = await place.geometry.location.lat()
      var lng = await place.geometry.location.lng()
      setplaceLat(lat)
      setplaceLng(lng)
      console.log("Child Component place", { lat: lat, lng: lng })


      // Set Weather Data here
      axios.get("https://api.weatherbit.io/v2.0/current?lat=" + lat + "&lon=" + lng + "&key=541cfe362491415a916c09fa122cccf1").then((response) => {
        console.log(response.data.data[0])
        setTemp(response.data.data[0].temp)

        setCityName(response.data.data[0].city_name)

      }).catch((error) => {
        console.log(error)
      })

    }



  }


  console.log(placeLat, placeLng, city)
  console.log("testadsf",process.env.REACT_APP_GOOGLE_MAP_API);

  return (
    <div className="App">
      <h1> Please Select Enter your City/Address</h1>
      <h2>
        {temp && city ? "Temperature of " + city + "is: " + temp + "°C" : null}
      </h2>
      <LoadScript
        libraries={["places"]}
        googleMapsApiKey="AIzaSyBuM60AoMrwB7dnMEOL7bge_3bM4DJtdn8"
      >
        <GoogleMap
          id="searchbox-example"
          mapContainerStyle={mapContainerStyle}
          zoom={19}
          center={{ lat: placeLat, lng: placeLng }}
          position={{ lat: placeLat, lng: placeLng }}
        // mapTypeId={"satellite"}
        >
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Enter Your  Location/Address"
              style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `330px`,
                height: `42px`,
                padding: `0 12px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `14px`,
                outline: `none`,
                textOverflow: `ellipses`,
                position: "absolute",
                left: "50%",
                marginLeft: "-120px",
                zIndex: 1000000,
                top: "9px",
              }}
            />
          </Autocomplete>
        </GoogleMap>
      </LoadScript>


    </div>
  );
}

export default App;