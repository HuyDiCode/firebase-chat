# Admin Chat Dashboard

A modern web chat admin dashboard built with **React** and **Firebase Realtime Database**. This application allows admins to manage conversations with multiple users in real-time.

## Features

✨ **Real-time Chat**: Live message updates using Firebase Realtime Database
👥 **User Management**: View all users who have chatted with the admin
📱 **Responsive Design**: Clean, minimal UI that works on desktop and mobile
⚡ **Modern React**: Built with React hooks and functional components
📝 **Message History**: View complete conversation history with each user
🔔 **Last Message Tracking**: Automatically tracks last message and timestamp

## Project Structure

```
src/
├── components/
│   ├── UserList.jsx         # Sidebar with list of users
│   ├── UserList.css
│   ├── ChatWindow.jsx       # Main chat message display
│   ├── ChatWindow.css
│   ├── MessageInput.jsx     # Message input form
│   └── MessageInput.css
├── hooks/
│   └── useFirebaseData.js   # Custom hook for Firebase Realtime listeners
├── firebase.js              # Firebase configuration and exports
├── App.jsx                  # Main application component
├── App.css
├── main.jsx                 # React entry point
└── index.css                # Global styles
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

Open `src/firebase.js` and replace the firebaseConfig object with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

To get these credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Click on your project settings (gear icon)
4. Copy the Web SDK credentials

### 3. Set Up Firebase Realtime Database

1. In Firebase Console, navigate to **Realtime Database**
2. Create a new database in **Test Mode** (for development)
3. Import the following structure (optional - it will be created automatically):

```json
{
  "chats": {
    "admin_user123": {
      "messages": {
        "-Nk12x": {
          "sender": "admin",
          "text": "Hello!",
          "timestamp": 1730000000000
        }
      },
      "lastMessage": "Hello!",
      "lastTimestamp": 1730000000000
    }
  },
  "users": {
    "user123": {
      "name": "John Doe",
      "lastChat": 1730000000000
    }
  }
}
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## How It Works

### Components

**UserList Component**

- Fetches all users from Firebase `/users` path
- Displays users sorted by last chat time (most recent first)
- Allows admin to select a user to chat with

**ChatWindow Component**

- Displays all messages for the selected user
- Messages are stored in `/chats/admin_<userId>/messages`
- Automatically scrolls to the latest message
- Shows different styling for sent and received messages

**MessageInput Component**

- Allows admin to send messages
- Updates both:
  - `/chats/admin_<userId>/messages` (stores individual messages)
  - `/chats/admin_<userId>` (lastMessage and lastTimestamp fields)

**useFirebaseData Hook**

- Custom React hook for real-time Firebase listeners
- Automatically subscribes/unsubscribes to changes
- Handles loading and error states

### Data Flow

1. When a message is sent, it's stored in Firebase with:

   - `sender`: "admin" (the admin's ID)
   - `text`: The message content
   - `timestamp`: Current timestamp in milliseconds

2. The `lastMessage` and `lastTimestamp` at the chat room level are updated for quick reference

3. All clients listening to this data path receive real-time updates

## Admin ID

The admin's ID is hardcoded as `"admin"`. This is used to:

- Create chat room IDs: `admin_<userId>`
- Mark messages sent by the admin
- Differentiate between sent and received messages in the UI

## Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

Preview the production build:

```bash
npm run preview
```

## Firebase Rules (Example)

For production, set up appropriate Firebase Realtime Database rules:

```json
{
  "rules": {
    "chats": {
      "admin_$userId": {
        ".read": "auth.uid === 'admin' || auth.uid === $userId",
        ".write": "auth.uid === 'admin' || auth.uid === $userId",
        "messages": {
          "$messageId": {
            ".validate": "newData.hasChildren(['sender', 'text', 'timestamp'])"
          }
        }
      }
    },
    "users": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Technologies Used

- **React 18**: Modern UI library with hooks
- **Firebase Realtime Database**: Real-time data synchronization
- **Vite**: Fast build tool and dev server
- **CSS3**: Modern styling with flexbox

## License

MIT
