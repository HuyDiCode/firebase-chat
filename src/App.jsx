import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import "./App.css";

function App() {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) {
    return <Login />;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className='app'>
      <header className='app-header'>
        <div className='header-left'>
          <h1>Admin Chat Dashboard</h1>
        </div>
        <button className='logout-button' onClick={handleLogout}>
          Logout
        </button>
      </header>
      <div className='app-container'>
        <div className='sidebar'>
          <UserList
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        </div>
        <div className='main-content'>
          <ChatWindow selectedUserId={selectedUserId} />
          <MessageInput
            selectedUserId={selectedUserId}
            onMessageSent={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
