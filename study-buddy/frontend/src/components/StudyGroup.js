import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudyGroup = ({ match }) => {
    const [group, setGroup] = useState({});
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const groupId = match.params.id;

    useEffect(() => {
        const fetchGroup = async () => {
            const response = await axios.get(`/api/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setGroup(response.data);
        };

        const fetchMessages = async () => {
            const response = await axios.get(`/api/groups/${groupId}/messages`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(response.data);
        };

        fetchGroup();
        fetchMessages();
    }, [groupId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/groups/${groupId}/messages`, { content: newMessage }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewMessage('');
            // Re-fetch messages after sending
            const response = await axios.get(`/api/groups/${groupId}/messages`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div>
            <h2>{group.name}</h2>
            <h3>Messages</h3>
            <ul>
                {messages.map((msg) => (
                    <li key={msg.id}>{msg.content}</li>
                ))}
            </ul>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default StudyGroup;
