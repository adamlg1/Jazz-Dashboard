
// // import React, { useState } from 'react';
// // import '../css/chat.css';

// // function ChatBot() {
// //     const [query, setQuery] = useState('');
// //     const [response, setResponse] = useState('');
// //     const [loading, setLoading] = useState(false);

// //     const handleSubmit = async () => {
// //         setLoading(true);
// //         const res = await fetch('http://localhost:5000/chat', {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ query })
// //         });
// //         const data = await res.json();
// //         setResponse(data.response);
// //         setLoading(false);
// //     };

// //     return (
// //         <div className="chat-container">
// //             <div className="chat-box">
// //                 <div className="messages">
// //                     {/* User's Message */}
// //                     <div className="user-message">{query}</div>
// //                     {/* Bot's Response */}
// //                     {response && <div className="bot-message">{response}</div>}
// //                     {loading && <div className="bot-message">Asking...</div>}
// //                 </div>
// //                 <div className="input-container">
// //                     <input
// //                         type="text"
// //                         className="chat-input"
// //                         value={query}
// //                         onChange={(e) => setQuery(e.target.value)}
// //                         placeholder="Ask me anything about Utah Jazz!"
// //                         autoFocus
// //                     />
// //                     <button className="chat-send-button" onClick={handleSubmit} disabled={loading}>
// //                         Send
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default ChatBot;
// import React, { useState, useEffect } from 'react';
// import '../css/chat.css';

// function ChatBot() {
//     const [query, setQuery] = useState('');
//     const [response, setResponse] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [statsData, setStatsData] = useState([]);  // To store player stats

//     // Fetch player stats when the component is mounted
//     useEffect(() => {
//         const fetchStats = async () => {
//             try {
//                 const res = await fetch('http://localhost:5000/api/stats');
//                 const data = await res.json();
//                 setStatsData(data);  // Set the fetched stats data
//             } catch (error) {
//                 console.error('Error fetching stats:', error);
//             }
//         };

//         fetchStats();  // Call the function to fetch stats
//     }, []);

//     const handleSubmit = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch('http://localhost:5000/api/chat', {  // Correct endpoint
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     userQuery: query,  // User's query
//                     statsData: statsData  // Pass the stats data here
//                 })
//             });

//             if (!res.ok) {
//                 throw new Error('Server error');
//             }

//             const data = await res.json();
//             setResponse(data.answer);  // Update the state with the response from the backend
//         } catch (error) {
//             console.error('Error fetching response:', error);
//             setResponse('Error fetching response from the server.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="chat-container">
//             <div className="chat-box">
//                 <div className="messages">
//                     {/* User's Message */}
//                     <div className="user-message">{query}</div>
//                     {/* Bot's Response */}
//                     {response && <div className="bot-message">{response}</div>}
//                     {loading && <div className="bot-message">Asking...</div>}
//                 </div>
//                 <div className="input-container">
//                     <input
//                         type="text"
//                         className="chat-input"
//                         value={query}
//                         onChange={(e) => setQuery(e.target.value)}
//                         placeholder="Ask me anything about Utah Jazz!"
//                         autoFocus
//                     />
//                     <button className="chat-send-button" onClick={handleSubmit} disabled={loading}>
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default ChatBot;
import React, { useState, useEffect } from 'react';
import '../css/chat.css';

function ChatBot() {
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState([]);  // Track all messages (user and bot)
    const [loading, setLoading] = useState(false);
    const [statsData, setStatsData] = useState([]);  // To store player stats

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

    const handleSubmit = async () => {
        setLoading(true);
        const newUserMessage = { role: "user", content: query };  // Prepare user's message

        // Add user's message to the message history
        setMessages(prevMessages => [...prevMessages, newUserMessage]);

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

            // Add bot's response to the message history
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error fetching response:', error);
            const errorMessage = { role: "bot", content: 'Error fetching response from the server.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
            setQuery('');  // Clear the input field after the message is sent
        }
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
