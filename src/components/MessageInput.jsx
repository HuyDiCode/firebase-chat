import React, { useState } from "react";
import { database, ref, push, update } from "../firebase";
import "./MessageInput.css";

const ADMIN_ID = "admin";

const MessageInput = ({ selectedUserId, onMessageSent }) => {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() || !selectedUserId) return;

    setSending(true);

    try {
      const timestamp = Date.now();
      const chatRoomId = `admin_${selectedUserId}`;
      const messagesRef = ref(database, `chats/${chatRoomId}/messages`);

      // Push new message
      await push(messagesRef, {
        sender: ADMIN_ID,
        text: text.trim(),
        timestamp,
      });

      // Update lastMessage and lastTimestamp in the chat room root
      const chatRoomRef = ref(database, `chats/${chatRoomId}`);
      await update(chatRoomRef, {
        lastMessage: text.trim(),
        lastTimestamp: timestamp,
      });

      setText("");
      onMessageSent?.();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (!selectedUserId) {
    return (
      <div className='message-input disabled'>
        <p>Select a user first</p>
      </div>
    );
  }

  return (
    <form className='message-input' onSubmit={handleSendMessage}>
      <input
        type='text'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type a message...'
        disabled={sending}
      />
      <button type='submit' disabled={sending || !text.trim()}>
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
};

export default MessageInput;
