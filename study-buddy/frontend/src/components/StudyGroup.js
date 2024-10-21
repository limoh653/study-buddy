import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudyGroup = () => {
    const [groups, setGroups] = useState([]); // State to hold all study groups
    const [error, setError] = useState(''); // State to store error messages

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await axios.get('http://localhost:5000/study-group', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setGroups(response.data.study_groups); // Access the study_groups from the response
            } catch (error) {
                console.error('Failed to fetch groups:', error);
                setError('Failed to fetch study groups.');
            }
        };

        fetchGroups();
    }, []);

    return (
        <div>
            <h2>Your Study Groups</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
            {groups.length > 0 ? (
                <ul>
                    {groups.map((group) => (
                        <li key={group.id}>
                            <h3>{group.name}</h3>
                            
                            {/* Add any other relevant group details you want to display */}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No study groups found.</p> // Message if there are no groups
            )}
        </div>
    );
};

export default StudyGroup;
