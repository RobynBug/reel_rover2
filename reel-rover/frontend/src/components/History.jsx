import { useEffect, useState } from 'react';

export default function History({ token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setHistory(data.items || []);
        } else {
          console.error('Failed to fetch history:', data.error);
        }
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHistory();
    }
  }, [token]);

  if (loading) return <p>Loading history...</p>;
  if (history.length > 0) {
    return (
    <div>
      <h2>Your History</h2>
      {history.length === 0 ? " " : (
        <ul>
          {history.map((entry) => (
            <li key={entry.id}>
              {entry.action} — {entry.contentId} ({new Date(entry.timestamp).toLocaleString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  }
}