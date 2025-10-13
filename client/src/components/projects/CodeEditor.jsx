// client/src/components/projects/CodeEditor.jsx

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function CodeEditor({ value, onChange, projectId }) {
  const socket = useSocket();
  const editorRef = useRef(null);

  // Core States
  const [output, setOutput] = useState(
    "Run code (Ctrl/Cmd + Enter) to see the output..."
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [input, setInput] = useState(""); // User input data

  // 💥 NEW STATE: To select the language 💥
  const [language, setLanguage] = useState("javascript");

  // --- Debouncing Logic for Saving Code ---
  useEffect(() => {
    if (!socket || isExecuting) return;

    const timer = setTimeout(() => {
      socket.emit("save_code", { projectId, newCode: value });
      console.log("Code saved to database (debounced).");
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, socket, projectId, isExecuting]);

  // --- Real-time Code Change Receiver ---
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

  // --- Compiler Result Receiver ---
  useEffect(() => {
    if (!socket) return;

    const handleCodeResult = ({ result, error }) => {
      setIsExecuting(false);
      if (error) {
        setOutput(`ERROR:\n${error}`);
      } else {
        setOutput(`OUTPUT:\n${result}`);
      }
    };

    socket.on("code_execution_result", handleCodeResult);

    return () => {
      socket.off("code_execution_result", handleCodeResult);
    };
  }, [socket]);

  // --- Editor Change Handler ---
  function handleEditorChange(value, event) {
    onChange(value);
    if (socket) {
      socket.emit("code_change", { projectId, newCode: value });
    }
  }

  // --- Run Code Handler (Sends Input and Language) ---
  const handleRunCode = () => {
    if (isExecuting || !socket || !value) return;

    setIsExecuting(true);
    setOutput(`Executing ${language.toUpperCase()} code...`);

    // 💥 CRITICAL: Send all three fields to the server relay 💥
    socket.emit("execute_code", {
      projectId,
      code: value,
      input: input,
      language: language,
    });
    console.log(
      `Execution request sent for ${language}. Input: ${input
        .trim()
        .substring(0, 20)}...`
    );
  };

  // --- Keyboard Shortcut for Run (Cmd/Ctrl + Enter) ---
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRunCode();
    }
  };

  return (
    <div
      className="flex flex-col h-full rounded-lg overflow-hidden border border-zinc-800"
      onKeyDown={handleKeyDown}
    >
      {/* Run Button and Language Selector Header */}
      <div className="flex justify-between items-center p-2 bg-zinc-900">
        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-1 border border-zinc-700 bg-zinc-800 text-white rounded text-sm focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="javascript">JavaScript (Current)</option>
          <option value="python">Python</option>
          <option value="c">c</option>
          <option value="cpp">c++</option>
          <option value="java">Java</option>
          <option value="go">GO</option>
          <option value="php">PHP</option>
          <option value="rust">Rust</option>
        </select>

        {/* Run Button */}
        <Button
          onClick={handleRunCode}
          disabled={isExecuting}
          className="bg-green-600 hover:bg-green-700 text-white transition-colors"
        >
          <Play className="mr-2 h-4 w-4" />
          {isExecuting ? "Running..." : "Run Code"}
        </Button>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="60vh"
        language={language} // Set Monaco language mode dynamically
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          quickSuggestions: true,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />

      {/* UNIFIED TERMINAL PANEL - Programiz Style */}
      <div className="flex flex-col md:flex-row border-t border-zinc-800">
        {/* Input Text Area (Left Side) */}
        <div className="p-2 bg-zinc-900 text-white md:w-1/2 md:border-r border-zinc-800">
          <h3 className="font-semibold text-sm mb-1 text-yellow-400">
            Program Input
          </h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // Unified styles for a professional look
            className="w-full p-2 text-xs bg-zinc-950 text-gray-200 rounded-md resize-none h-32 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            style={{ border: "none" }}
          />
        </div>

        {/* Output Console (Right Side) */}
        <div className="p-2 bg-zinc-900 text-white md:w-1/2">
          <h3 className="font-semibold text-sm mb-1 text-purple-400">
            Console Output
          </h3>
          <pre
            // Unified styles for a professional look
            className="p-3 text-xs bg-zinc-950 text-gray-200 overflow-auto whitespace-pre-wrap rounded-md h-32"
            style={{
              color: output.startsWith("ERROR:") ? "#FF6B6B" : "inherit",
              border: "none",
            }}
          >
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
