import React, { useEffect, useState } from "react";
import { getJoinedGroups, joinGroup, leaveGroup, getAllGroups } from "../api";

const StudyGroup = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch both lists on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const [allRes, joinedRes] = await Promise.all([
          getAllGroups(),
          getJoinedGroups(token),
        ]);

        setAllGroups(allRes.data.study_groups || []);
        setJoinedGroups(joinedRes.data.joined_groups || []);
      } catch (error) {
        console.error("❌ Error fetching groups:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchGroups();
  }, [token]);

  // Handle join
  const handleJoin = async (groupId) => {
    try {
      await joinGroup(token, groupId);
      // Refresh joined groups after joining
      const res = await getJoinedGroups(token);
      setJoinedGroups(res.data.joined_groups || []);
    } catch (error) {
      console.error("❌ Error joining group:", error.response?.data || error.message);
    }
  };

  // Handle leave
  const handleLeave = async (groupId) => {
    try {
      await leaveGroup(token, groupId);
      // Refresh joined groups after leaving
      const res = await getJoinedGroups(token);
      setJoinedGroups(res.data.joined_groups || []);
    } catch (error) {
      console.error("❌ Error leaving group:", error.response?.data || error.message);
    }
  };

  if (loading) return <p>⏳ Loading groups...</p>;

  return (
    <div className="study-groups">
      <h2>My Groups</h2>
      {joinedGroups.length === 0 ? (
        <p>You are not a member of any group</p>
      ) : (
        <ul>
          {joinedGroups.map((group) => (
            <li key={group.id}>
              <strong>{group.name}</strong> ({group.members.length} members)
              <button onClick={() => handleLeave(group.id)}>Leave</button>
            </li>
          ))}
        </ul>
      )}

      <h2>All Groups</h2>
      {allGroups.length === 0 ? (
        <p>No study groups available</p>
      ) : (
        <ul>
          {allGroups.map((group) => (
            <li key={group.id}>
              <strong>{group.name}</strong> ({group.members.length} members)
              {joinedGroups.some((jg) => jg.id === group.id) ? (
                <button disabled>Joined</button>
              ) : (
                <button onClick={() => handleJoin(group.id)}>Join</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudyGroup;
