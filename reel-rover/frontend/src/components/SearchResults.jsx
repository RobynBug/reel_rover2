import React from 'react'
import '../styles/SearchResults.css';

export default function SearchResults({ results }) {
  if (!results || results.length === 0) return <p>No results found.</p>;

  return (
    <div className="results-grid">
      {results.map((item) => {
        if (item.media_type === 'person') return null;
        const title = item.title || item.name;
        const imageUrl = item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : 'https://via.placeholder.com/300x450?text=No+Image';

        return (
          <div key={item.id} className="result-card">
            <img src={imageUrl} alt={title} className="result-image" />
            <h3>{title}</h3>
            <p>{item.media_type}</p>
            <button onClick={() => addToWatchlist(item)}>Add to Watchlist</button>
          </div>
        );
      })}
    </div>
  );
}
