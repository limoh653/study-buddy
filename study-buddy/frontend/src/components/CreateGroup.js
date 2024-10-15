import React, { useState } from 'react';
import axios from 'axios';

const CreateGroup = () => {
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/groups', { name, subject }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Redirect or update UI
        } catch (error) {
            console.error('Failed to create group:', error);
        }
    };

    return (
        <form onSubmit={handleCreateGroup}>
            <input type="text" placeholder="Group Name" onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
            <button type="submit">Create Group</button>
        </form>
    );
};

export default CreateGroup;
