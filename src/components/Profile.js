import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

import './Profile.css';

const supabaseUrl = 'https://cjqwfctqdxtwyvvqohya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcXdmY3RxZHh0d3l2dnFvaHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3MzEyNzYsImV4cCI6MjAwMTMwNzI3Nn0.sy61dt6QbjsdPFDGd4Ej7_zO65vi4MPWvqq_bH3KwU8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function getCurrentUserEmail() {
  
  
    const { data: { user } } = await supabase.auth.getUser();
    
    /*
    if (error) {
        console.error(error);
        return null;
    }
    */
    
    if (user) {
        const email = user.id;
        return email;
    }
    //return null;
}

export default function Profile() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      const email = await getCurrentUserEmail();
      
      if (email) {
        try {
          
            let { data: reserved, error } = await supabase
            .from('reserved')
            .select('reservedName')
            .eq('email',email)
            
            if (error) {
                throw new Error(error.message);
            } else if (reserved) {
                const { reservedName } = reserved[0];
                setUsername(reservedName);
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
    console.log(username); // Log the updated username value
  }, [username]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <h2 style={{color:'white'}}>
        adsfaf: {username}
    </h2>
  );
  
  
}
