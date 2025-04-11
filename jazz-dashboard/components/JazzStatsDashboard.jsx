import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function JazzStatsDashboard() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('points');
    const [filterBy, setFilterBy] = useState('all');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    // if you don't do this the toast shows up twice :/
    const toastShown = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            if (!toastShown.current) {
                toast.info('Please log in to access the stats page.');
                toastShown.current = true;
            }
            navigate('/login');
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate]);

    useEffect(() => {
        if (!isAuthenticated) return;

        const token = localStorage.getItem('authToken');
        fetch('http://localhost:5000/api/stats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    toast.error('Session expired or invalid. Please log in again.');
                    localStorage.removeItem('authToken');
                    navigate('/login');
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
                toast.error('Failed to fetch stats. Please try again.');
            });
    }, [isAuthenticated, navigate]);

    // Sort stats by selected stat
    const sortStats = (stats, sortBy) => {
        return stats.sort((a, b) => b[sortBy] - a[sortBy]);
    };

    // Filter stats by player position
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
                    </tr>
                </thead>
                <tbody>
                    {sortedStats.map((player) => (
                        <tr key={player.id}>
                            <td>{player.player_name}</td>
                            <td>{player.points}</td>
                            <td>{player.total_rebounds}</td>
                            <td>{player.assists}</td>
                            <td>{player.steals}</td>
                            <td>{player.blocks}</td>
                            <td>{player.fg_percentage ? (player.fg_percentage * 100).toFixed(1) + "%" : "N/A"}</td>
                            <td>{player.three_p_percentage ? (player.three_p_percentage * 100).toFixed(1) + "%" : "N/A"}</td>
                            <td>{player.free_throws_percentage ? (player.free_throws_percentage * 100).toFixed(1) + "%" : "N/A"}</td>
                            <td>{player.minutes_per_game}</td>
                            <td>{player.games_played}</td>
                            <td>{player.games_started}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ToastContainer />  {/* Add ToastContainer here to show the toasts */}
        </div>
    );
}

export default JazzStatsDashboard;
