import React, { useEffect, useState } from "react";
import { getJoinedGroups, joinGroup, leaveGroup, getAllGroups } from "../api";

const StudyGroup = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

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

  const handleJoin = async (groupId) => {
    try {
      await joinGroup(token, groupId);
      const res = await getJoinedGroups(token);
      setJoinedGroups(res.data.joined_groups || []);
    } catch (error) {
      console.error("❌ Error joining group:", error.response?.data || error.message);
    }
  };

  const handleLeave = async (groupId) => {
    try {
      await leaveGroup(token, groupId);
      const res = await getJoinedGroups(token);
      setJoinedGroups(res.data.joined_groups || []);
    } catch (error) {
      console.error("❌ Error leaving group:", error.response?.data || error.message);
    }
  };

  if (loading) return <p className="text-center py-6">⏳ Loading groups...</p>;

  // Filter other groups
  const otherGroups = allGroups.filter(
    (group) => !joinedGroups.some((jg) => jg.id === group.id)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* My Groups */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">📚 My Groups</h2>
        {joinedGroups.length === 0 ? (
          <p className="text-gray-500">You are not a member of any group</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {joinedGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 border rounded-xl shadow-sm flex flex-col justify-between bg-white"
              >
                <div>
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    👥 {group.members.length} members
                  </p>
                </div>
                <button
                  onClick={() => handleLeave(group.id)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                >
                  🚪 Leave
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Other Groups */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🌍 Other Groups</h2>
        {otherGroups.length === 0 ? (
          <p className="text-gray-500">No other study groups available</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {otherGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 border rounded-xl shadow-sm flex flex-col justify-between bg-white"
              >
                <div>
                  <h3 className="font-semibold text-lg">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    👥 {group.members.length} members
                  </p>
                </div>
                <button
                  onClick={() => handleJoin(group.id)}
                  className="mt-3 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition"
                >
                  ➕ Join
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudyGroup;
