import React, { useState, useEffect } from 'react';

function JazzStatsDashboard() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('points'); // Default sorting by points
    const [filterBy, setFilterBy] = useState('all'); // Filter by all players by default

    // Fetch stats when the component mounts
    useEffect(() => {
        fetch('http://localhost:5000/api/stats')
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

    // Sort stats by selected stat
    const sortStats = (stats, sortBy) => {
        return stats.sort((a, b) => b[sortBy] - a[sortBy]);
    };

    // Filter stats by player position (if needed)
    const filterStats = (stats, filterBy) => {
        if (filterBy === 'all') return stats;
        return stats.filter((player) => player.position === filterBy);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const sortedStats = sortStats(filterStats(stats, filterBy), sortBy);

    return (
        <div className="dashboard">
            <header>
                <h1>Utah Jazz Stats - 2025 Season</h1>
                <div className="filters">
                    <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                        <option value="points">Sort by Points</option>
                        <option value="rebounds">Sort by Rebounds</option>
                        <option value="assists">Sort by Assists</option>
                        <option value="steals">Sort by Steals</option>
                        <option value="blocks">Sort by Blocks</option>
                    </select>
                    <select onChange={(e) => setFilterBy(e.target.value)} value={filterBy}>
                        <option value="all">View All Players</option>
                        <option value="PF">View Power Forwards</option>
                        <option value="SG">View Shooting Guards</option>
                        <option value="PG">View Point Guards</option>
                        <option value="SF">View Small Forwards</option>
                        <option value="C">View Centers</option>
                    </select>
                </div>
            </header>

            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Points</th>
                        <th>Rebounds</th>
                        <th>Assists</th>
                        <th>Steals</th>
                        <th>Blocks</th>
                        <th>FG%</th>
                        <th>3P%</th>
                        <th>FT%</th>
                        <th>Minutes</th>
                        <th>Games Played</th>
                        <th>Games Started</th>
                        {/* <th>+/-</th> */}
                    </tr>
                </thead>
                <tbody>
                    {sortedStats.map((player) => (
                        <tr key={player.id}>
                            <td>{player.player_name}</td>  {/* Updated to match player_name */}
                            <td>{player.points}</td>
                            <td>{player.total_rebounds}</td>
                            <td>{player.assists}</td>
                            <td>{player.steals}</td>
                            <td>{player.blocks}</td>
                            <td>{player.fg_percentage ? (player.fg_percentage * 100).toFixed(1) + "%" : "N/A"}</td>  {/* Format percentages */}
                            <td>{player.three_p_percentage ? (player.three_p_percentage * 100).toFixed(1) + "%" : "N/A"}</td>
                            <td>{player.free_throws_percentage ? (player.free_throws_percentage * 100).toFixed(1) + "%" : "N/A"}</td>
                            <td>{player.minutes_per_game}</td>
                            <td>{player.games_played}</td>
                            <td>{player.games_started}</td>
                            {/* <td>{player['+/-']}</td>  Handle the + sign in key */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default JazzStatsDashboard;
