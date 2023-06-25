import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import './Profile.css';

const supabaseUrl = 'https://cjqwfctqdxtwyvvqohya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcXdmY3RxZHh0d3l2dnFvaHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3MzEyNzYsImV4cCI6MjAwMTMwNzI3Nn0.sy61dt6QbjsdPFDGd4Ej7_zO65vi4MPWvqq_bH3KwU8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getCurrentUserEmail() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
        const email = user.email;
        return email;
    }
}

export default function Profile() {
    const [reservedNames, setReservedNames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [playerData, setPlayerInfo] = useState([]);
    const [playerLevels, setPlayerLevels] = useState([]);

    function getPlayerInfo(uname) {
        return axios
          .get("http://localhost:4000/playerInfo", { params: { username: uname } })
          .then(function (response) {
            return response.data.summonerLevel;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
      

    useEffect(() => {
        console.log(reservedNames); // Log the updated username value

        const getPlayerLevels = async () => {
        const levels = await Promise.all(
            reservedNames.map((name) => getPlayerInfo(name))
        );
        setPlayerLevels(levels);
        };

        getPlayerLevels();
    }, [reservedNames]);

    useEffect(() => {
        const fetchUsername = async () => {
        const email = await getCurrentUserEmail();
        console.log(email);
        
        if (email) {
            try {
            let { data: reserved, error } = await supabase
                .from('reserved')
                .select('reservedName')
                .eq('email', email);
            
            if (error) {
                throw new Error(error.message);
            } else if (reserved && reserved.length > 0) {
                const reservedNamesArray = reserved[0]?.reservedName || [];
                setReservedNames(reservedNamesArray);
            }
            } catch (error) {
                setError(error.message);
            }
        }
        setIsLoading(false);
        };

        fetchUsername();
  }, []);

  useEffect(() => {
    console.log(reservedNames); // Log the updated username value
  }, [reservedNames]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      {/* ... */}
      <ul className="reserved-names-list">
        {reservedNames.length > 0 ? (
          reservedNames.map((name, index) => (
            <li key={index}>
              {name}: {playerLevels[index] || 'Loading...'}
            </li>
          ))
        ) : (
          <li>No reserved names found.</li>
        )}
      </ul>
    </div>
  );
}
