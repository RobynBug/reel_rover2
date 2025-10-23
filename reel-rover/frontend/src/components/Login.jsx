import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        onLogin(data.token); // ✅ Store the token
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isSignup ? 'Create Account' : 'Log In'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isSignup ? 'Sign Up' : 'Log In'}</button>
      <p>
        {isSignup ? 'Already have an account?' : 'New here?'}{' '}
        <button type="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Log In' : 'Create Account'}
        </button>
      </p>
    </form>
  );
}