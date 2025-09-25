import React, { useEffect, useState } from "react";
import api from "../api";

const StudyGroup = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    // Fetch all study groups
    const fetchAllGroups = async () => {
      try {
        const response = await api.get("/study-group");
        setAllGroups(response.data.study_groups || []);
      } catch (error) {
        console.error("❌ Error fetching all groups:", error.response?.data || error.message);
      }
    };

    // Fetch groups joined by logged-in user
    const fetchMyGroups = async () => {
      try {
        const response = await api.get("/my-groups", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setMyGroups(response.data.joined_groups || []);
      } catch (error) {
        console.error("❌ Error fetching my groups:", error.response?.data || error.message);
      }
    };

    fetchAllGroups();
    fetchMyGroups();
  }, []);

  return (
    <div>
      <h2>📚 All Study Groups</h2>
      {allGroups.length > 0 ? (
        <ul>
          {allGroups.map((group) => (
            <li key={group.id}>
              <strong>{group.name}</strong> ({group.members.length} members)
            </li>
          ))}
        </ul>
      ) : (
        <p>No study groups found.</p>
      )}

      <h2>✅ My Joined Groups</h2>
      {myGroups.length > 0 ? (
        <ul>
          {myGroups.map((group) => (
            <li key={group.id}>
              <strong>{group.name}</strong> ({group.members.length} members)
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven’t joined any groups yet.</p>
      )}
    </div>
  );
};

export default StudyGroup;
