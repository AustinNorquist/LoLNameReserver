import './Search.css';
import React, { useState } from 'react';
import axios from 'axios';
import defaultIcon from '../images/defaultIcon.jpeg';
import * as moment from 'moment';

function Search() {
  const [searchText, setSearchText] = useState("");
  const [recentActivity, setRecentActivity] =useState([]);
  const [playerData, setPlayerInfo] = useState([]);
  var searchOpacity = document.getElementById('searchContainer');

  function getRecentGame(event) {
    axios.get("http://localhost:4000/recentGame", { params: { username: searchText }})
          .then(function(response){
            setRecentActivity(response.data);
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

  function userAvailable(user){
    return (
      <>
        <h2 style={{color:'green'}} className='availability'>Available!</h2>
        <img
          className='icons' 
          src={"http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/" + user.profileIconId + ".png"}
        />
        <h2 className='username'>{user.name}</h2>
        <h2 className='level'>{user.summonerLevel}</h2>
        <p className='expiration'>Expired: </p>
        <p className='expirationDate'>{getFormattedDate(playerData,recentActivity)} </p>
      </>
    );
  }

  function getExpirationDate(user,recentActivity) {
    var decayMonths;
    
    if(user.summonerLevel <= 6){
      decayMonths = 6;
    }else if(user.summonerLevel < 30){
      decayMonths = user.summonerLevel;
    }else{
      decayMonths = 30;
    }

    const date = new Date(recentActivity);
    const dateObj = new Date(date.setMonth(date.getMonth() + decayMonths));

    return dateObj.getTime();
  }

  function isExpired(playerData) {
    
    const decayTime = getExpirationDate(playerData,recentActivity);

    if((decayTime < Date.now())){
      return true;
    }else{
      return false;
    }
  }

  function getFormattedDate(playerData,recentActivity) {
    
    const decayTime = getExpirationDate(playerData,recentActivity);

    const dateObj = new Date(decayTime);
    dateObj.setHours(dateObj.getHours()-1);

    return moment(dateObj).format('MMMM Do YYYY, h:mm:ss a');
  }

  function userUnavailable(user,recentActivity) {
    return (
      <>
        <h2 style={{color:'red'}} className='availability'>Unavailable</h2>
        <img
          className='icons' 
          src={"http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/" + user.profileIconId +".png"}
        />
        <h2 className='username'>{user.name}</h2>
        <h2 className='level'>{user.summonerLevel}</h2>
        <p className='expiration'>Expires: </p>
        <p className='expirationDate'>{getFormattedDate(playerData,recentActivity)} </p>
      </>
    );
  }

  console.log(recentActivity);

  return (
    <div className="App">
      <div className='header'>
        <title className='headerLogo'>
          dafa
        </title>
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
            searchOpacity.style.opacity = "1";
          }}
        >
          Search
        </button>
        
        <div id = 'searchContainer' className='searchResultContainer'>
          {
            //every account with data has a level, undefined means no data 
            playerData.summonerLevel !== undefined ?

            <>
              {
               //display based on if isExpired
               isExpired(playerData) ? 
               <>
                <p>
                  {userAvailable(playerData)}
                </p>
               </>

               :

               <>
                <p>
                  {userUnavailable(playerData,recentActivity,true)}
                </p>
               </>
              }
            </>
            : //no player data found
            <>
              <h2 className='availability'>Available!</h2>
              <img src={defaultIcon} className='icons'/>
              <h2 className='username'></h2>
            </>

          }
        </div>
      </div>
    </div>
  );
}

export default Search;
