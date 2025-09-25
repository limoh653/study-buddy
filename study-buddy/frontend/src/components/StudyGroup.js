import React, { useEffect, useState } from "react";
import {
  fetchGroups,
  joinGroup,
  fetchJoinedGroups,
} from "../api"; // ✅ using the updated api.js

const StudyGroup = () => {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch all groups + my groups on mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const [allRes, joinedRes] = await Promise.all([
          fetchGroups(),
          fetchJoinedGroups(),
        ]);
        setGroups(allRes.data.study_groups || []);
        setMyGroups(joinedRes.data.joined_groups || []);
      } catch (error) {
        console.error("❌ Error loading groups:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  const handleJoin = async (groupId) => {
    try {
      await joinGroup(groupId);
      // refresh groups after joining
      const joinedRes = await fetchJoinedGroups();
      setMyGroups(joinedRes.data.joined_groups || []);
    } catch (error) {
      console.error("❌ Error joining group:", error.response?.data || error.message);
    }
  };

  if (loading) return <p>⏳ Loading study groups...</p>;

  return (
    <div className="study-groups">
      <h2>📚 All Study Groups</h2>
      {groups.length === 0 ? (
        <p>No groups available.</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li key={group.id}>
              {group.name}{" "}
              {!myGroups.find((g) => g.id === group.id) && (
                <button onClick={() => handleJoin(group.id)}>Join</button>
              )}
            </li>
          ))}
        </ul>
      )}

      <h2>✅ My Groups</h2>
      {myGroups.length === 0 ? (
        <p>You haven’t joined any groups yet.</p>
      ) : (
        <ul>
          {myGroups.map((group) => (
            <li key={group.id}>{group.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudyGroup;
