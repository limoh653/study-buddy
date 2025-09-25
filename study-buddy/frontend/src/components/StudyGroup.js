import React, { useEffect, useState } from "react";
import api from "../api"; // axios instance configured with BASE_URL

const StudyGroup = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch all study groups
  const fetchAllGroups = async () => {
    try {
      const response = await api.get("/study-group");
      setAllGroups(
        response.data.study_groups.map((g) => ({ ...g, showMembers: false }))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching all groups");
    }
  };

  // ✅ Fetch groups the user has joined
  const fetchMyGroups = async () => {
    try {
      const response = await api.get("/my-groups", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMyGroups(
        (response.data.joined_groups || []).map((g) => ({
          ...g,
          showMembers: false,
        }))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching my groups");
    }
  };

  // ✅ Join group
  const joinGroup = async (groupId) => {
    try {
      const response = await api.post(
        "/study-group/join",
        { groupId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setMyGroups(
        (response.data.joined_groups || []).map((g) => ({
          ...g,
          showMembers: false,
        }))
      );
      setMessage("✅ Joined group successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error joining group");
      setMessage("");
    }
  };

  // ✅ Leave group
  const leaveGroup = async (groupId) => {
    try {
      const response = await api.post(
        "/study-group/leave",
        { groupId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      // update myGroups after leaving
      setMyGroups((prev) =>
        prev.filter((group) => group.id !== groupId)
      );

      setMessage("✅ Left group successfully!");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error leaving group");
      setMessage("");
    }
  };

  // ✅ Toggle members list
  const toggleMembers = (groupId, isMyGroup) => {
    if (isMyGroup) {
      setMyGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, showMembers: !g.showMembers } : g
        )
      );
    } else {
      setAllGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, showMembers: !g.showMembers } : g
        )
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllGroups();
      await fetchMyGroups();
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading study groups...</p>;

  return (
    <div className="study-groups-container">
      <h2>📚 Study Groups</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {/* My Groups */}
      <div className="groups-section">
        <h3>✅ My Groups</h3>
        {myGroups.length > 0 ? (
          <ul>
            {myGroups.map((group) => (
              <li key={group.id}>
                <strong>{group.name}</strong>
                <button onClick={() => leaveGroup(group.id)}>Leave</button>
                <button onClick={() => toggleMembers(group.id, true)}>
                  {group.showMembers ? "Hide Members" : "Show Members"}
                </button>
                {group.showMembers && group.members.length > 0 && (
                  <ul>
                    {group.members.map((m) => (
                      <li key={m.id}>{m.username}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven’t joined any groups yet.</p>
        )}
      </div>

      {/* Other Groups */}
      <div className="groups-section">
        <h3>📌 Other Groups</h3>
        {allGroups.length > 0 ? (
          <ul>
            {allGroups
              .filter((g) => !myGroups.some((mg) => mg.id === g.id))
              .map((group) => (
                <li key={group.id}>
                  <strong>{group.name}</strong>
                  <button onClick={() => joinGroup(group.id)}>Join</button>
                  <button onClick={() => toggleMembers(group.id, false)}>
                    {group.showMembers ? "Hide Members" : "Show Members"}
                  </button>
                  {group.showMembers && group.members.length > 0 && (
                    <ul>
                      {group.members.map((m) => (
                        <li key={m.id}>{m.username}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
          </ul>
        ) : (
          <p>No groups available.</p>
        )}
      </div>
    </div>
  );
};

export default StudyGroup;
