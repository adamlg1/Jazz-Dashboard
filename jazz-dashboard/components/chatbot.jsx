import React, { useState, useEffect, useRef } from 'react';
import '../css/chat.css';

function ChatBot() {
    const [query, setQuery] = useState('');          // User's typed query
    const [messages, setMessages] = useState([]);    // Track all messages (user and bot)
    const [loading, setLoading] = useState(false);   // Track if bot is processing the query
    const [statsData, setStatsData] = useState([]);  // To store player stats
    const messagesEndRef = useRef(null);             // Reference to the end of the messages container
    const inputRef = useRef(null);                    // Reference to the input (textarea) field

    // Fetch player stats when the component is mounted
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/stats');
                const data = await res.json();
                setStatsData(data);  // Set the fetched stats data
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();  // Call the function to fetch stats
    }, []);

    useEffect(() => {
        // Scroll to the bottom whenever the messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]); // Trigger scroll on messages change

    const handleSubmit = async () => {
        if (!query.trim()) return; // Prevent submission if the query is empty

        setLoading(true);

        // Add the user's message to the message history
        const newUserMessage = { role: "user", content: query };

        // Add the user's message and immediately show "Asking..." for the bot
        setMessages(prevMessages => [...prevMessages, newUserMessage, { role: "bot", content: "Asking..." }]);

        // Clear the query input field after the message is submitted
        setQuery('');

        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userQuery: query,  // User's query
                    statsData: statsData  // Pass the stats data here
                })
            });

            if (!res.ok) {
                throw new Error('Server error');
            }

            const data = await res.json();
            const botMessage = { role: "bot", content: data.answer };  // Prepare bot's response

            // Replace the last "Asking..." message with the bot's response, but keep the user's message
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = botMessage; // Replace the last "Asking..." message
                return updatedMessages;
            });
        } catch (error) {
            console.error('Error fetching response:', error);
            const errorMessage = { role: "bot", content: 'Error fetching response from the server.' };
            setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1] = errorMessage; // Replace the last "Asking..." message with an error message
                return updatedMessages;
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle pressing Enter key to submit the message
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {  // Submit only when Enter is pressed without Shift
            event.preventDefault(); // Prevent a new line from being added
            handleSubmit();
        }
    };

    // Handle the change in the textarea (to dynamically adjust the size)
    const handleInputChange = (event) => {
        setQuery(event.target.value);

        // Resize the textarea based on content
        const textarea = inputRef.current;
        textarea.style.height = "auto";  // Reset the height before calculating new height
        textarea.style.height = `${textarea.scrollHeight}px`;  // Adjust height based on content
    };

    return (
        <div className="chat-container">
            <div className="chat-box">
                <div className="messages">
                    {/* Loop through messages to display all */}
                    {messages.map((msg, index) => (
                        <div key={index} className={msg.role === "user" ? "user-message" : "bot-message"}>
                            {msg.content}
                        </div>
                    ))}
                    {/* Empty div to scroll to the bottom */}
                    <div ref={messagesEndRef} />
                </div>
                <div className="input-container">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        value={query}
                        onChange={handleInputChange} // Handle the input change for dynamic resizing
                        onKeyDown={handleKeyPress}  // Add event listener for Enter key
                        placeholder="Ask me anything about Utah Jazz!"
                        autoFocus
                        rows={1}  // Start with 1 row (for initial height)
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
