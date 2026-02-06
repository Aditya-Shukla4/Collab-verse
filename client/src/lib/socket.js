import { io } from "socket.io-client";

const URL =
  process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
  "https://collab-verse-server.onrender.com";
const socket = io(URL, {
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log("Socket Event:", event, args);
});

export default socket;
