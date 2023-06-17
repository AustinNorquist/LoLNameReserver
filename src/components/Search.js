import './Search.css';
import axios from 'axios';
import defaultIcon from '../images/defaultIcon.jpeg';
import * as moment from 'moment';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';

const supabaseUrl = 'https://cjqwfctqdxtwyvvqohya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcXdmY3RxZHh0d3l2dnFvaHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3MzEyNzYsImV4cCI6MjAwMTMwNzI3Nn0.sy61dt6QbjsdPFDGd4Ej7_zO65vi4MPWvqq_bH3KwU8';
const supabase = createClient(supabaseUrl, supabaseKey);

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

  async function getCurrentUserEmail() {
  
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const email = user.email;
      return email;
    }
  }

  function handleClaim() {
      
      const insertToDb = async () => {
        const email = await getCurrentUserEmail();

        const { data: existingData, error: existingError } = await supabase
          .from('reserved')
          .select('reservedName')
          .eq('email', email)
          .single();
        
        if (existingError) {
          console.error('Error retrieving existing data:', existingError);
          return;
        }

        let updatedNames;

        if (Array.isArray(existingData.reservedName)) {
          // Append the new name to the existing names array
          const lowercaseNames = existingData.reservedName.map((name) => name.toLowerCase());
          const lowercaseNewName = searchText.toLowerCase();
          
          if (lowercaseNames.includes(lowercaseNewName)) {
            console.log('Name already exists in the array.');
            return;
          }

          updatedNames = [...existingData.reservedName, searchText];
        } else {
          // Create a new array with the existing name (if any) and the new name
          updatedNames = existingData.reservedName ? [existingData.reservedName, searchText] : [searchText];
        }

        const { data, error } = await supabase
          .from('reserved')
          .update({ reservedName: updatedNames })
          .eq('email',email)

        if (error) {
          console.error('Error updating data:', error);
        } else {
          console.log('Name appended successfully:', data);
        }
      };
 
      insertToDb();
  }

  function userAvailable(user){
    return (
      <>
        <h2 style={{color:'green'}} className='availability'>Available!</h2>
        <img
          className='icons' 
          src={"http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/" + user.profileIconId + ".png"}
        />
        <h2 className='username'>
          <a>
            {user.name}
          </a>
        </h2>
        <h2 className='level'>{user.summonerLevel}</h2>
        <p className='expiration'>Expired: </p>
        <p className='expirationDate'>{getFormattedDate(playerData,recentActivity)} </p>
      </>
    );
  }

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null
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

    return moment(dateObj).format('MMMM Do YYYY, hh:mm:ss a');
  }

  function userUnavailable(user,recentActivity) {
    return (
      <>
        <h2 style={{color:'red'}} className='availability'>Unavailable</h2>
        <img
          className='icons' 
          src={"http://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/" + user.profileIconId +".png"}
        />
        <h1 
          onClick={() => openInNewTab('https://www.op.gg/summoners/na/' + playerData.name)}
          className='username'>
            {user.name}
        </h1>
        <h2 className='level'>{user.summonerLevel}</h2>
        <p className='expiration'>Expires: </p>
        <p className='expirationDate'>{getFormattedDate(playerData,recentActivity)} </p>
        <button className="claim-button" onClick={handleClaim}>Claim</button>
      </>
    );
  }

  console.log(recentActivity);

  return (
    <div className="App">
      <div>
        <div className='searchField'>
          <input 
            className='searchBox' 
            type='text'
            placeholder='Enter a username...'
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={(event) => {
              if(event.key === "Enter" && searchText.length >= 3 && searchText.length <= 16){
                getRecentGame();
                getPlayerInfo();
                searchOpacity.style.opacity = "1";
              }
            }}
          >
          </input>

          <button 
            className='searchButton'
            onClick={() => {
              if(searchText.length >= 3 && searchText.length <= 15){
                getRecentGame();
                getPlayerInfo();
                searchOpacity.style.opacity = "1";
              }
            }}
          >
            Search
          </button>
        </div>
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
                  {userUnavailable(playerData,recentActivity)}
                </p>
               </>
              }
            </>
            : //no player data found
            <>
              <h2 
                style={{color:'green'}}
                className='availability'>Available!
              </h2>
              <img src={defaultIcon} className='icons'/>
              <h2 className='username'></h2>
              <p  className='expiration'
              
              >No Player Data Found.</p>
              <button className="claim-button" 
                onClick={handleClaim}>Claim</button>
            </>

          }
        </div>
      </div>
    </div>
  );
}

export default Search;
