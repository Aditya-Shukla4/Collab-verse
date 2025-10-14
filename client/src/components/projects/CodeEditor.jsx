"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

// Client-side only Monaco Editor
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CodeEditor({
  value,
  onChange,
  projectId,
  projectData,
}) {
  const socket = useSocket();
  const [output, setOutput] = useState("Run code...");
  const [isExecuting, setIsExecuting] = useState(false);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("javascript");

  // ✅ Load saved language from localStorage or DB
  useEffect(() => {
    const savedLang = localStorage.getItem(`lang-${projectId}`);
    if (savedLang) {
      setLanguage(savedLang);
    } else if (projectData?.codeLanguage) {
      setLanguage(projectData.codeLanguage);
    }
  }, [projectData, projectId]);

  // ✅ Save language whenever it changes
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    localStorage.setItem(`lang-${projectId}`, newLang);
    if (socket)
      socket.emit("save_code", {
        projectId,
        newCode: value,
        language: newLang,
      });
  };

  // ✅ Auto-save code (debounced)
  useEffect(() => {
    if (!projectData) return;
    const timer = setTimeout(() => {
      socket?.emit("save_code", { projectId, newCode: value, language });
    }, 1200);
    return () => clearTimeout(timer);
  }, [value, language, socket, projectId, projectData]);

  // ✅ Real-time sync
  useEffect(() => {
    if (!socket) return;
    const handleCodeReceive = (receivedCode) => onChange(receivedCode);
    socket.on("receive_code_change", handleCodeReceive);
    return () => socket.off("receive_code_change", handleCodeReceive);
  }, [socket, onChange]);

  // ✅ Receive execution results
  useEffect(() => {
    if (!socket) return;
    const handleCodeResult = ({ result, error }) => {
      setIsExecuting(false);
      setOutput(error ? `ERROR:\n${error}` : `OUTPUT:\n${result}`);
    };
    socket.on("code_execution_result", handleCodeResult);
    return () => socket.off("code_execution_result", handleCodeResult);
  }, [socket]);

  const handleEditorChange = (newValue) => {
    onChange(newValue);
    socket?.emit("code_change", { projectId, newCode: newValue });
  };

  const handleRunCode = () => {
    if (isExecuting || !socket || !value) return;
    setIsExecuting(true);
    setOutput(`Executing ${language.toUpperCase()} code...`);
    socket.emit("execute_code", { projectId, code: value, input, language });
  };

  return (
    <div className="flex flex-col h-full rounded-lg overflow-hidden border border-zinc-800">
      <div className="flex justify-between items-center p-2 bg-zinc-900">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-1 border border-zinc-700 bg-zinc-800 text-white rounded text-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
          <option value="php">PHP</option>
          <option value="rust">Rust</option>
        </select>
        <Button
          onClick={handleRunCode}
          disabled={isExecuting}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Play className="mr-2 h-4 w-4" />
          {isExecuting ? "Running..." : "Run Code"}
        </Button>
      </div>

      <Editor
        height="60vh"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        options={{ fontSize: 14, minimap: { enabled: false } }}
        beforeMount={(monaco) => {
          // Enable JS/TS linting & red marks
          monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
          });
          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: false,
            noSyntaxValidation: false,
          });
        }}
      />

      <div className="flex flex-col md:flex-row border-t border-zinc-800">
        <div className="p-2 bg-zinc-900 md:w-1/2 md:border-r border-zinc-800">
          <h3 className="font-semibold text-sm mb-1 text-yellow-400">
            Program Input
          </h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-2 text-xs bg-zinc-950 text-gray-200 rounded-md resize-none h-32"
            placeholder="Enter program input here..."
          />
        </div>
        <div className="p-2 bg-zinc-900 md:w-1/2">
          <h3 className="font-semibold text-sm mb-1 text-purple-400">
            Console Output
          </h3>
          <pre
            className="p-3 text-xs bg-zinc-950 text-gray-200 overflow-auto whitespace-pre-wrap rounded-md h-32"
            style={{
              color: output.startsWith("ERROR:") ? "#FF6B6B" : "inherit",
            }}
          >
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
