import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [playerSearchText, setPlayerSearchText] = useState("");
  const [playerData, setPlayerData] = useState({});  
  const API_KEY = "RGAPI-f51fa401-6320-4bac-98c0-3c9837af52a7";

  function searchForPlayer(event){
    var APICallString = 
    "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name" + playerSearchText + "?api_key=" + API_KEY;

    axios.get(APICallString).then(function(response) {
      //Name exists
      setPlayerData(response.data);

    }).catch(function(error){

    })
  }

  console.log(playerData)

  return (
    <div className="App">
      <div className='container'>
        <h1>LoL Name Reserver</h1>
      </div>

      <div>
        <input 
          className='searchBox' 
          type='text'
          onChange={e => setPlayerSearchText(e.target.value)}
        >
        </input>
        <button 
          className='searchButton'
          onClick={e => searchForPlayer(e)}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default App;
