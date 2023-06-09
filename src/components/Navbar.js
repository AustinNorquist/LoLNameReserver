import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cjqwfctqdxtwyvvqohya.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqcXdmY3RxZHh0d3l2dnFvaHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU3MzEyNzYsImV4cCI6MjAwMTMwNzI3Nn0.sy61dt6QbjsdPFDGd4Ej7_zO65vi4MPWvqq_bH3KwU8';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const session = await supabase.auth.session;
      setUser(session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/Login"; // Redirect to the desired page after logout (e.g., Home)
  };

  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        LoL Name Reserver
      </Link>
      <ul>
        <CustomLink to="/">Home</CustomLink>
        <CustomLink to="/Search">Search</CustomLink>
        { user ? (
          <CustomLink to="/Profile">Profile</CustomLink>
        ):(
          <CustomLink to="/Login">Profile</CustomLink>
        )}
        
        {user ? (
          <CustomLink onClick={handleLogout}>Logout</CustomLink>
        ) : (
          <CustomLink to="/Login">Login</CustomLink>
        )}
      </ul>
    </nav>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
