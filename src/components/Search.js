import './Search.css';
import React, { useState } from 'react';
import axios from 'axios';
import defaultIcon from '../images/defaultIcon.jpeg';

function Search() {
  const [searchText, setSearchText] = useState("");
  const [recentGameTimestamp, setRecentGame] =useState([]);
  const [playerData, setPlayerInfo] = useState([]);

  function getRecentGame(event) {
    axios.get("http://localhost:4000/recentGame", { params: { username: searchText }})
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

  function userAvailable(username){
    return (
      <> 
        <h2 className='availability'>Available!</h2>
        <img src={defaultIcon} className='icons'/>
        <h2 className='username'>{username}</h2>
      </>
    );
  }

  function getExpirationDate(user) {
    var decayMonths;
    var resTime;
    const oneMonth = 2629743 * 1000; //time in seconds
    if(user.summonerLevel <= 6){
      decayMonths = 6;
    }else if(user.summonerLevel < 30){
      decayMonths = user.summonerLevel;
    }else{
      decayMonths = 30;
    }

    resTime = decayMonths * oneMonth;
    return resTime;
  }

  function isExpired(user,recentGameTimestamp) {
    if((recentGameTimestamp + getExpirationDate(user) < Date.now())){
      return true;
    }else{
      return false;
    }
  }

  function formattedExpirationDate(recentGameTimestamp){
    var decayTime = getExpirationDate(playerData);
  }

  function userUnavailable(user,recentGameTimestamp) {
    return (
      <>
        <h2 className='availability'>Unavailable</h2>
        <img
          className='icons' 
          src={"http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/" + user.profileIconId +".png"}
        />
        <h2 className='username'>{user.name}</h2>
        <p className='expiration'>Expires: {formattedExpirationDate(recentGameTimestamp)} </p>
      </>
    );
  }

  function handleSearchContainer(){

  }

  console.log(recentGameTimestamp);

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

            <>
              {
               //display based on if isExpired
               isExpired(playerData,recentGameTimestamp) ? 
               <>
                <p>
                  {userAvailable(playerData.name)}
                </p>
               </>

               :

               <>
                <p>
                  {userUnavailable(playerData,recentGameTimestamp)}
                </p>
               </>
              }
            </>
            : //no player data found
            <>
              <p>
                no player data found
                {userAvailable()}
              </p> 
            </>

          }
        </div>
      
      </div>
    
    </div>
  
  );
}

export default Search;
