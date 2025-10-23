// services/tmdbService.js

// IMPORTANT: In a real application, replace this placeholder with
// your actual Bearer token loaded from a secure environment variable.
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || 'YOUR_BEARER_TOKEN_HERE';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Handles authenticated API requests to The Movie Database.
 * @param {string} endpoint - The path fragment after the base URL (e.g., '/search/multi?query=inception').
 * @returns {Promise<object>} The JSON response data from TMDB.
 */
export async function fetchTMDB(endpoint) {
    // 1. Check for token availability
    if (TMDB_ACCESS_TOKEN === 'YOUR_BEARER_TOKEN_HERE') {
        throw new Error("TMDB_ACCESS_TOKEN is not configured. Please set it as an environment variable.");
    }

    const url = `${TMDB_BASE_URL}${endpoint}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Use the Bearer Token for authorization (preferred by TMDB v3/v4)
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`
            }
        });

        // 2. Handle non-200 responses (API errors, rate limiting)
        if (!response.ok) {
            const errorBody = await response.json();
            console.error(`TMDB API Error (${response.status}):`, errorBody);
            // Throw a specific error based on the response status
            throw new Error(`TMDB API request failed with status ${response.status}: ${errorBody.status_message || 'Unknown error'}`);
        }

        // 3. Return the parsed JSON data
        return response.json();

    } catch (error) {
        // Re-throw the error for the router to handle
        console.error('Network or Parse Error:', error.message);
        throw error;
    }
}
