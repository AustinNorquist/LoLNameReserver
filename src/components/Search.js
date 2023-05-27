import './Search.css';
import React, { useState } from 'react';
import axios from 'axios';
import defaultIcon from '../images/defaultIcon.jpeg';

function Search() {
  const [searchText, setSearchText] = useState("");
  const [gameList, setGameList] =useState([]);

  function getPlayerGames(event) {
    axios.get("http://localhost:4000/past5Games", { params: { username: searchText}})
          .then(function(response){
            setGameList(response.data);
          }).catch(function(error){
            console.log(error);
          })
  }

  console.log(gameList);

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
          onClick={getPlayerGames}
        >
          Search
        </button>
        
        {gameList.length !== 0 ?
          <>
            <div className='searchResultContainer'>
              <p>
                found
              </p> 
            </div>
          </>
        :
          <>
            <div className='searchResultContainer'>
              <h2 className='availability'>
                Available!
                <img src={defaultIcon} className='icons'/>
              </h2>
            </div>
          </>

        }
      
      </div>
    
    </div>
  
  );
}

export default Search;
