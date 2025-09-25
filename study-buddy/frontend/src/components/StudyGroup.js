import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './StudyGroup.css';

const StudyGroup = () => {
    const [groups, setGroups] = useState([]);
    const [joinedGroups, setJoinedGroups] = useState([]);
    const [otherGroups, setOtherGroups] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchGroups = async () => {
            if (!token) {
                setError('You need to log in to access study groups.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(
                    'https://study-buddy-24.onrender.com/study-group',
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const groupsWithMembers = response.data.study_groups.map(group => ({
                    ...group,
                    members: group.members || [],
                    showMembers: false,
                }));

                setGroups(groupsWithMembers);

                // Separate joined and other groups
                const joined = groupsWithMembers.filter(group =>
                    group.members.some(member => member.id === parseInt(localStorage.getItem('userId')))
                );
                const others = groupsWithMembers.filter(group =>
                    !group.members.some(member => member.id === parseInt(localStorage.getItem('userId')))
                );

                setJoinedGroups(joined);
                setOtherGroups(others);

                setError('');
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, [token]);

    const joinGroup = async (groupId) => {
        try {
            const response = await axios.post(
                'https://study-buddy-24.onrender.com/study-group/join',
                { groupId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateGroups(response.data.members, groupId, true);
            setMessage('You have successfully joined the group.');
            setError('');
        } catch (error) {
            handleError(error);
        }
    };

    const leaveGroup = async (groupId) => {
        try {
            const response = await axios.post(
                'https://study-buddy-24.onrender.com/study-group/leave',
                { groupId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            updateGroups(response.data.members, groupId, false);
            setMessage('You have successfully left the group.');
            setError('');
        } catch (error) {
            handleError(error);
        }
    };

    const updateGroups = (members, groupId, joined) => {
        // Update group in main list
        setGroups(prevGroups =>
            prevGroups.map(group =>
                group.id === groupId ? { ...group, members } : group
            )
        );

        // Update joined and other groups separately
        if (joined) {
            const joinedGroup = groups.find(group => group.id === groupId);
            if (joinedGroup) {
                setJoinedGroups(prev => [...prev, { ...joinedGroup, members }]);
                setOtherGroups(prev => prev.filter(group => group.id !== groupId));
            }
        } else {
            const leftGroup = groups.find(group => group.id === groupId);
            if (leftGroup) {
                setOtherGroups(prev => [...prev, { ...leftGroup, members }]);
                setJoinedGroups(prev => prev.filter(group => group.id !== groupId));
            }
        }
    };

    const toggleMembers = (groupId) => {
        setGroups(prevGroups =>
            prevGroups.map(group =>
                group.id === groupId ? { ...group, showMembers: !group.showMembers } : group
            )
        );
    };

    const handleError = (error) => {
        if (error.response) {
            console.error('Error:', error.response.data);
            setError(error.response.data.message || 'An error occurred.');
        } else {
            console.error('Error:', error.message);
            setError('An error occurred.');
        }
        setMessage('');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="study-group-container">
            <h2>Joined Groups</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

            {joinedGroups.length > 0 ? (
                <ul>
                    {joinedGroups.map(group => (
                        <li key={group.id}>
                            <h3>{group.name}</h3>
                            <button onClick={() => leaveGroup(group.id)}>Leave Group</button>
                            <button onClick={() => toggleMembers(group.id)}>
                                {group.showMembers ? 'Hide Members' : 'Show Members'}
                            </button>
                            {group.showMembers && group.members.length > 0 && (
                                <div>
                                    <h4>Members:</h4>
                                    <ul>
                                        {group.members.map(member => (
                                            <li key={member.id}>{member.username}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You have not joined any groups yet.</p>
            )}

            <h2>Other Groups</h2>
            {otherGroups.length > 0 ? (
                <ul>
                    {otherGroups.map(group => (
                        <li key={group.id}>
                            <h3>{group.name}</h3>
                            <button onClick={() => joinGroup(group.id)}>Join Group</button>
                            <button onClick={() => toggleMembers(group.id)}>
                                {group.showMembers ? 'Hide Members' : 'Show Members'}
                            </button>
                            {group.showMembers && group.members.length > 0 && (
                                <div>
                                    <h4>Members:</h4>
                                    <ul>
                                        {group.members.map(member => (
                                            <li key={member.id}>{member.username}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No other study groups available.</p>
            )}
        </div>
    );
};

export default StudyGroup;
