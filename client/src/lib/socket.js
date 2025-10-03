// client/src/lib/socket.js

import { io } from "socket.io-client";

const URL = "http://localhost:5000"; // Your backend server URL
const socket = io(URL, {
  autoConnect: false, // We will connect manually
});

// For debugging: log all events
socket.onAny((event, ...args) => {
  console.log("Socket Event:", event, args);
});

export default socket;
