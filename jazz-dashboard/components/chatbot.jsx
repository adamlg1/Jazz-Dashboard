import React, { useState, useEffect, useRef } from 'react';
import '../css/chat.css';
import { toast } from 'react-toastify';

function ChatBot() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statsData, setStatsData] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);  // Runs only once when the component mounts

    useEffect(() => {
        if (!isAuthenticated) return;  // Don't fetch stats if the user is not authenticated!!!!! really don't

        const fetchStats = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const res = await fetch('http://localhost:5000/api/stats', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error('Unauthorized. Please log in.');
                }
                const data = await res.json();
                setStatsData(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
                toast.error('Please log in to access the stats.');
            }
        };

        fetchStats();
    }, [isAuthenticated]);

    // Scroll to the bottom of the messages container
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]); // Trigger scroll on messages change

    const handleSubmit = async () => {
        if (!query.trim()) return; // Prevent submission if the query is empty

        setLoading(true);

        // Add the user's message to the message history
        const newUserMessage = { role: "user", content: query };
        setMessages(prevMessages => [...prevMessages, newUserMessage, { role: "bot", content: "Asking..." }]);

        setQuery(''); // Clear the input field

        const token = localStorage.getItem('authToken');  // Get the JWT token from localStorage
        console.log(token);

        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userQuery: query,
                    statsData: statsData,
                }),
            });

            if (!res.ok) {
                throw new Error('Error with the server or invalid token');
            }

            const data = await res.json();
            const botMessage = { role: "bot", content: data.answer };

            // Replace the last "Asking..." message with the bot's response
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = botMessage;
                return updatedMessages;
            });
        } catch (error) {
            console.error('Error fetching response:', error);
            const errorMessage = { role: "bot", content: 'Error fetching response from the server.' };
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = errorMessage;
                return updatedMessages;
            });
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {  // Submit only when Enter is pressed without Shift
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        const textarea = inputRef.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
                            {msg.content}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="input-container">
                    {!isAuthenticated ? (
                        <div>Please log in to access the chatbot.</div>
                    ) : (
                        <>
                            <textarea
                                ref={inputRef}
                                className="chat-input"
                                value={query}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask me anything about Utah Jazz!"
                                autoFocus
                                rows={1}
                            />
                            <button className="chat-send-button" onClick={handleSubmit} disabled={loading}>
                                Send
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatBot;
