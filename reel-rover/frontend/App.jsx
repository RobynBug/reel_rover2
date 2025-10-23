import { useState } from 'react';
import SearchBar from './src/components/Searchbar';
import SearchResults from './src/components/SearchResults';
import Watchlist from './src/components/Watchlist';
import History from './src/components/History';
import Login from './src/components/Login';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogin = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <h1>Welcome to Reel Rover</h1>
      <button onClick={handleLogout}>Log Out</button>
      <Watchlist token={token} />
      <History token={token} />
    </div>
  );
}

export default App;