import React, { useState, useEffect } from 'react';

function App() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/jazz-stats')  // Make sure to replace with your API endpoint
            .then(response => response.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);  // Empty dependency array means this runs once when the component mounts

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Utah Jazz Stats 2025</h1>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Points</th>
                        <th>Rebounds</th>
                        <th>Assists</th>
                        <th>Steals</th>
                        <th>Blocks</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((stat, index) => (
                        <tr key={index}>
                            <td>{stat.player}</td>
                            <td>{stat.points}</td>
                            <td>{stat.rebounds}</td>
                            <td>{stat.assists}</td>
                            <td>{stat.steals}</td>
                            <td>{stat.blocks}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
