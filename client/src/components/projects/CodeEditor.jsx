// client/src/components/projects/CodeEditor.jsx

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { useSocket } from "@/context/SocketContext";

export default function CodeEditor({ value, onChange, projectId }) {
  const socket = useSocket();
  const editorRef = useRef(null);

  // This effect handles the DEBOUNCING logic for saving code
  useEffect(() => {
    if (!socket) return;

    // Set a timer to save the code after 1.5 seconds of inactivity
    const timer = setTimeout(() => {
      socket.emit("save_code", { projectId, newCode: value });
    }, 1500);

    // If the user types again, clear the timer and start a new one
    return () => {
      clearTimeout(timer);
    };
  }, [value, socket, projectId]); // This effect re-runs every time the 'value' changes

  // This effect handles receiving real-time code changes from other users
  useEffect(() => {
    if (!socket) return;

    const handleCodeReceive = (receivedCode) => {
      onChange(receivedCode);
    };

    socket.on("receive_code_change", handleCodeReceive);

    return () => {
      socket.off("receive_code_change", handleCodeReceive);
    };
  }, [socket, onChange]);

  function handleEditorChange(value, event) {
    // Only emit the change to other users, don't save from here.
    // The saving is handled by the debouncing effect above.
    onChange(value);
    if (socket) {
      socket.emit("code_change", { projectId, newCode: value });
    }
  }

  return (
    <Editor
      height="60vh"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={value}
      onChange={handleEditorChange}
      options={{ fontSize: 14, minimap: { enabled: false } }}
    />
  );
}
