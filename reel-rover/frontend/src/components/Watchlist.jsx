import { useEffect, useState } from 'react';

export default function Watchlist({ token }) {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const res = await fetch('/api/watchlist', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setWatchlist(data.items || []);
        } else {
          console.error('Failed to fetch watchlist:', data.error);
        }
      } catch (err) {
        console.error('Error fetching watchlist:', err);
      }
    };

    if (token) {
      fetchWatchlist();
    }
  }, [token]);
if (watchlist.length > 0) {
      return (
    <div>
      <h2>Your Watchlist</h2>
      <ul>
        {watchlist.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
  }
}