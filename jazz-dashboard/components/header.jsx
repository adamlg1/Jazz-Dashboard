import React from 'react';
import { Link } from 'react-router-dom'; // For navigation between pages

function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                {/* Logo and Home link */}
                <Link className="navbar-brand" to="/">
                    <img
                        src="https://seeklogo.com/images/U/utah-jazz-1996-2004-logo-E496606DE0-seeklogo.com.png"
                        alt="Logo"
                        width="30"
                        height="30"
                        className="d-inline-block align-text-top"
                    />
                    Utah Jazz Stats
                </Link>

                {/* Toggle button for mobile view */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">
                                Login
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/stats">
                                Stats
                            </Link>
                        </li>

                        <li className='nav-item'>
                            <Link className='nav-link' to="/chat">
                                ChatBot
                            </Link>

                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/about">
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
