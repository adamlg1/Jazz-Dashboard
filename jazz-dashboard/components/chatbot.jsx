
import React, { useState } from 'react';
import '../css/chat.css';

function ChatBot() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:5000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });
        const data = await res.json();
        setResponse(data.response);
        setLoading(false);
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <div className="messages">
                    {/* User's Message */}
                    <div className="user-message">{query}</div>
                    {/* Bot's Response */}
                    {response && <div className="bot-message">{response}</div>}
                    {loading && <div className="bot-message">Asking...</div>}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        className="chat-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask me anything about Utah Jazz!"
                        autoFocus
                    />
                    <button className="chat-send-button" onClick={handleSubmit} disabled={loading}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChatBot;
