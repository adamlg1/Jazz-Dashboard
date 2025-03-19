import React, { useState, useEffect } from 'react';

function JazzStatsDashboard() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch stats when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/api/jazz-stats')
            .then((response) => response.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="dashboard">
            <h1>Utah Jazz Stats - 2025 Season</h1>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Points</th>
                        <th>Rebounds</th>
                        <th>Assists</th>
                        <th>Steals</th>
                        <th>Blocks</th>
                        <th>Plus-Minus</th>
                    </tr>
                </thead>
                <tbody>
                    {stats.map((player) => (
                        <tr key={player.player}>
                            <td>{player.player}</td>
                            <td>{player.points}</td>
                            <td>{player.rebounds}</td>
                            <td>{player.assists}</td>
                            <td>{player.steals}</td>
                            <td>{player.blocks}</td>
                            <td>{player['+/-']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default JazzStatsDashboard;
