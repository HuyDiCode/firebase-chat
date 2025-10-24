import React, { useEffect, useRef, useState } from "react";
import { useFirebaseData } from "../hooks/useFirebaseData";
import { userAPI } from "../api";
import "./ChatWindow.css";

const ADMIN_ID = "admin";

const ChatWindow = ({ selectedUserId }) => {
  const chatPath = selectedUserId
    ? `chats/admin_${selectedUserId}/messages`
    : null;
  const [messages, loading, error] = useFirebaseData(chatPath);
  const [userInfo, setUserInfo] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch user info when selectedUserId changes
  useEffect(() => {
    if (!selectedUserId) {
      setUserInfo(null);
      return;
    }

    const fetchUserInfo = async () => {
      setUserLoading(true);
      try {
        const response = await userAPI.getUserById(selectedUserId);
        const userData = response.data;
        // Map backend field names to our format
        setUserInfo({
          id: userData.id,
          fullName: userData.fullName || userData.name || selectedUserId,
          email: userData.email,
          avatar: userData.avatar,
          phoneNumber: userData.phoneNumber,
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        setUserInfo({
          id: selectedUserId,
          fullName: selectedUserId,
          email: "",
          avatar: null,
        });
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserInfo();
  }, [selectedUserId]);

  if (!selectedUserId) {
    return (
      <div className='chat-window empty'>
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='chat-window'>
        <div className='chat-header'>
          <div className='chat-header-placeholder'>Loading...</div>
        </div>
        <div className='messages'>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='chat-window error'>
        <p>Error loading messages: {error}</p>
      </div>
    );
  }

  const messageList = messages
    ? Object.entries(messages).map(([msgId, msgData]) => ({
        id: msgId,
        ...msgData,
      }))
    : [];

  // Sort messages by timestamp
  messageList.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        {userInfo && (
          <div className='chat-header-info'>
            {userInfo.avatar && (
              <img
                src={userInfo.avatar}
                alt={userInfo.fullName}
                className='chat-header-avatar'
              />
            )}
            <div className='chat-header-text'>
              <h3>{userInfo.fullName}</h3>
              <p>{userInfo.email}</p>
            </div>
          </div>
        )}
        {userLoading && <p className='loading'>Loading user info...</p>}
      </div>
      <div className='messages'>
        {messageList.length === 0 ? (
          <p className='no-messages'>No messages yet</p>
        ) : (
          messageList.map((msg) => (
            <div
              key={msg.id}
              className={`message ${
                msg.sender === ADMIN_ID ? "sent" : "received"
              }`}
            >
              <div className='message-content'>{msg.text}</div>
              <div className='message-time'>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
