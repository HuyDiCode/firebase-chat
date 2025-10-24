import React, { useState, useEffect } from "react";
import { useFirebaseData } from "../hooks/useFirebaseData";
import { userAPI } from "../api";
import "./UserList.css";

const UserList = ({ selectedUserId, onSelectUser }) => {
  const [chats, loading, error] = useFirebaseData("chats");
  const [userCache, setUserCache] = useState({});
  const [fetchingUsers, setFetchingUsers] = useState(false);

  // Extract user IDs from chat rooms and fetch their details
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!chats) return;

      const userIds = Object.entries(chats)
        .filter(([chatId]) => chatId.startsWith("admin_"))
        .map(([chatId]) => chatId.replace("admin_", ""));

      if (userIds.length === 0) return;

      setFetchingUsers(true);
      try {
        // Fetch details for each user (only if not cached)
        const usersToFetch = userIds.filter((id) => !userCache[id]);

        for (const userId of usersToFetch) {
          try {
            const response = await userAPI.getUserById(userId);
            const userData = response.data;
            // Map backend field names
            setUserCache((prev) => ({
              ...prev,
              [userId]: {
                id: userData.id,
                fullName: userData.fullName || userData.name || userId,
                email: userData.email,
                avatar: userData.avatar,
                phoneNumber: userData.phoneNumber,
              },
            }));
          } catch (err) {
            console.error(`Failed to fetch user ${userId}:`, err);
            // If user not found, use fallback
            setUserCache((prev) => ({
              ...prev,
              [userId]: { id: userId, fullName: userId },
            }));
          }
        }
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchUserDetails();
  }, [chats]);

  if (loading) {
    return (
      <div className='user-list'>
        <p>Loading conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='user-list error'>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Build user list from chat rooms with backend info
  const userList = chats
    ? Object.entries(chats)
        .filter(([chatId]) => chatId.startsWith("admin_"))
        .map(([chatId, chatData]) => {
          const userId = chatId.replace("admin_", "");
          const userInfo = userCache[userId] || {};
          return {
            id: userId,
            fullName: userInfo.fullName || userId,
            email: userInfo.email || "",
            avatar: userInfo.avatar || "",
            lastMessage: chatData.lastMessage || "No messages",
            lastTimestamp: chatData.lastTimestamp || 0,
          };
        })
    : [];

  // Sort by last timestamp (most recent first)
  userList.sort((a, b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0));

  return (
    <div className='user-list'>
      <h2>
        Conversations {fetchingUsers && <span className='loading'>...</span>}
      </h2>
      {userList.length === 0 ? (
        <p className='no-users'>No conversations yet</p>
      ) : (
        <ul>
          {userList.map((user) => (
            <li
              key={user.id}
              className={`user-item ${
                selectedUserId === user.id ? "active" : ""
              }`}
              onClick={() => onSelectUser(user.id)}
            >
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className='user-avatar'
                />
              )}
              <div className='user-info'>
                <div className='user-name'>{user.fullName}</div>
                <div className='user-message'>{user.lastMessage}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
