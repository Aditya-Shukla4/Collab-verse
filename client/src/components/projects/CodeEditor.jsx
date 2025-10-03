// client/src/components/projects/CodeEditor.jsx

import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useSocket } from "@/context/SocketContext";

// Component now accepts projectId
export default function CodeEditor({ value, onChange, projectId }) {
  const socket = useSocket();

  function handleEditorChange(value, event) {
    // 1. Update the local state
    onChange(value);
    // 2. Send the new code to the server
    if (socket) {
      socket.emit("code_change", { projectId, newCode: value });
    }
  }

  // Effect for listening to incoming code changes
  useEffect(() => {
    if (!socket) return;

    const handleCodeReceive = (receivedCode) => {
      // Update the editor's content with the code from another user
      onChange(receivedCode);
    };

    socket.on("receive_code_change", handleCodeReceive);

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("receive_code_change", handleCodeReceive);
    };
  }, [socket, onChange]);

  return (
    <Editor
      height="60vh"
      defaultLanguage="javascript"
      theme="vs-dark"
      value={value}
      onChange={handleEditorChange}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        contextmenu: false,
      }}
    />
  );
}
