import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudyGroup.css';

const BASE_URL = "https://study-buddy-24.onrender.com"; // Correct backend URL

const StudyGroup = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You need to log in to access study groups.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${BASE_URL}/study-group`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const groupsWithMembers = response.data.study_groups.map(group => ({
                    ...group,
                    members: group.members || [],
                    showMembers: false,
                }));

                setGroups(groupsWithMembers);
                setError('');
            } catch (err) {
                handleError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const joinGroup = async (groupId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You need to log in to join a group.');
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/study-group/join`,
                { groupId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.id === groupId ? { ...group, members: response.data.members } : group
                )
            );

            setMessage('You have successfully joined the group.');
            setError('');
        } catch (err) {
            handleError(err);
        }
    };

    const leaveGroup = async (groupId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You need to log in to leave a group.');
            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/study-group/leave`,
                { groupId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setGroups(prevGroups =>
                prevGroups.map(group =>
                    group.id === groupId ? { ...group, members: response.data.members } : group
                )
            );

            setMessage('You have successfully left the group.');
            setError('');
        } catch (err) {
            handleError(err);
        }
    };

    const toggleMembers = (groupId) => {
        setGroups(prevGroups =>
            prevGroups.map(group =>
                group.id === groupId ? { ...group, showMembers: !group.showMembers } : group
            )
        );
    };

    const handleError = (err) => {
        if (err.response) {
            console.error('Error:', err.response.data);
            setError(err.response.data.message || 'An error occurred.');
        } else {
            console.error('Error:', err.message);
            setError('An error occurred.');
        }
        setMessage('');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    // Separate groups into My Groups and Other Groups
    const myGroups = groups.filter(group => group.members.some(member => member.id === parseInt(localStorage.getItem('userId'))));
    const otherGroups = groups.filter(group => !group.members.some(member => member.id === parseInt(localStorage.getItem('userId'))));

    return (
        <div className="study-groups-container">
            <h2>Study Groups</h2>
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}

            <div className="groups-section">
                <div className="group-list">
                    <h3>My Groups</h3>
                    {myGroups.length > 0 ? (
                        <ul>
                            {myGroups.map(group => (
                                <li key={group.id}>
                                    <h4>{group.name}</h4>
                                    <button onClick={() => leaveGroup(group.id)}>Leave Group</button>
                                    <button onClick={() => toggleMembers(group.id)}>
                                        {group.showMembers ? 'Hide Members' : 'Show Members'}
                                    </button>
                                    {group.showMembers && group.members.length > 0 && (
                                        <ul>
                                            {group.members.map(member => (
                                                <li key={member.id}>{member.username}</li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>You are not a member of any group.</p>
                    )}
                </div>

                <div className="group-list">
                    <h3>Other Groups</h3>
                    {otherGroups.length > 0 ? (
                        <ul>
                            {otherGroups.map(group => (
                                <li key={group.id}>
                                    <h4>{group.name}</h4>
                                    <button onClick={() => joinGroup(group.id)}>Join Group</button>
                                    <button onClick={() => toggleMembers(group.id)}>
                                        {group.showMembers ? 'Hide Members' : 'Show Members'}
                                    </button>
                                    {group.showMembers && group.members.length > 0 && (
                                        <ul>
                                            {group.members.map(member => (
                                                <li key={member.id}>{member.username}</li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No other groups available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyGroup;
