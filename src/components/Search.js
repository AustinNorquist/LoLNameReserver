import './Search.css';
import React, { useState } from 'react';
import axios from 'axios';
import defaultIcon from '../images/defaultIcon.jpeg';

function Search() {
  const [searchText, setSearchText] = useState("");
  const [recentGame, setRecentGame] =useState([]);
  const [playerData, setPlayerInfo] = useState([]);

  function getRecentGame(event) {
    axios.get("http://localhost:4000/recentGame", { params: { username: searchText}})
          .then(function(response){
            setRecentGame(response.data);
          }).catch(function(error){
            console.log(error);
          })
  }

  function getPlayerInfo(event) {
    axios.get("http://localhost:4000/playerInfo", { params: { username: searchText}})
          .then(function(response){
            setPlayerInfo(response.data);
          }).catch(function(error){
            console.log(error);
          })
  }

  console.log(recentGame);

  return (
    <div className="App">
      
      <div className='header'>
        <a className='headerLogo'>
          dafa
        </a>
      </div>
      
      <div>

        <input 
          className='searchBox' 
          type='text'
          onChange={e => setSearchText(e.target.value)}
        >
        </input>

        <button 
          className='searchButton'
          onClick={() => {
            getRecentGame();
            getPlayerInfo();
          }}
        >
          Search
        </button>
        
        <div className='searchResultContainer'>
          {

            //every account with data has a level, undefined means no data 
            playerData.summonerLevel !== undefined ?
              //if there is data for the username,
              //check if the 'recentGame' exceeds the decay time.
              //level 1-6, 6 months
              //level 12, 12 months
              //level 20, 20 months
              //level 30+, 30 months
              
              //compare if recentGame.'timestamp' is less than (current unix timestamp - 'x' unix months)
              //if true, then the username has expired
              //else the username is unavailable

            <> 
            
            </>
            :
            <>
                <h2 className='availability'> Available!</h2>
                <img src={defaultIcon} className='icons'/>
            </>

          }
        </div>
      
      </div>
    
    </div>
  
  );
}

export default Search;
