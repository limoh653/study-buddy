import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudyGroup = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:5000/study-group', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setGroups(response.data.study_groups);
            } catch (error) {
                console.error('Failed to fetch groups:', error);
                setError('Failed to fetch study groups.');
            }
        };

        fetchGroups();
    }, []);

    const joinGroup = async (groupId) => {
        try {
            const response = await axios.post('http://localhost:5000/study-group/join', 
            { groupId }, 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Update the group with the new member after successfully joining
            setGroups((prevGroups) =>
                prevGroups.map((group) => {
                    if (group.id === groupId) {
                        return { ...group, members: response.data.members };
                    }
                    return group;
                })
            );
        } catch (error) {
            console.error('Failed to join group:', error);
            setError('Failed to join the study group.');
        }
    };

    const leaveGroup = async (groupId) => {
        try {
            const response = await axios.post('http://localhost:5000/study-group/leave', 
            { groupId }, 
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            // Update the group after successfully leaving
            setGroups((prevGroups) =>
                prevGroups.map((group) => {
                    if (group.id === groupId) {
                        return { ...group, members: response.data.members };
                    }
                    return group;
                })
            );
        } catch (error) {
            console.error('Failed to leave group:', error);
            setError('Failed to leave the study group.');
        }
    };

    const toggleMembers = (groupId) => {
        setGroups((prevGroups) =>
            prevGroups.map((group) => {
                if (group.id === groupId) {
                    return { ...group, showMembers: !group.showMembers };
                }
                return group;
            })
        );
    };

    return (
        <div>
            <h2>Your Study Groups</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {groups.length > 0 ? (
                <ul>
                    {groups.map((group) => (
                        <li key={group.id}>
                            <h3>{group.name}</h3>
                            <button onClick={() => joinGroup(group.id)}>Join Group</button>
                            <button onClick={() => leaveGroup(group.id)}>Leave Group</button>
                            <button onClick={() => toggleMembers(group.id)}>
                                {group.showMembers ? 'Hide Members' : 'Show Members'}
                            </button>
                            {group.showMembers && group.members && group.members.length > 0 && (
                                <div>
                                    <h4>Members:</h4>
                                    <ul>
                                        {group.members.map((member) => (
                                            <li key={member.id}>{member.username}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No study groups found.</p>
            )}
        </div>
    );
};

export default StudyGroup;
