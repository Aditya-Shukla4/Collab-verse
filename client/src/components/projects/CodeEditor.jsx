"use client";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { Play } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LANGUAGES = [
  "javascript",
  "python",
  "c",
  "cpp",
  "java",
  "go",
  "php",
  "rust",
];
const COMPILER_URL =
  process.env.NEXT_PUBLIC_COMPILER_API_URL || "http://localhost:6001";

export default function CodeEditor({
  value,
  onChange,
  projectId,
  projectData,
  terminalWriter,
}) {
  const socket = useSocket();
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const lastReceivedCode = useRef(null);

  const writeOutput = (text) => {
    if (terminalWriter?.current) terminalWriter.current(text);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`lang-${projectId}`);
      if (saved) setLanguage(saved);
      else if (projectData?.codeLanguage) setLanguage(projectData.codeLanguage);
    } catch {
      console.warn("localStorage not available");
    }
  }, [projectData, projectId]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    try {
      localStorage.setItem(`lang-${projectId}`, newLang);
    } catch {}
    socket?.emit("save_code", { projectId, newCode: value, language: newLang });
  };

  // Auto-save
  useEffect(() => {
    if (!projectData) return;
    const t = setTimeout(() => {
      socket?.emit("save_code", { projectId, newCode: value, language });
    }, 1500);
    return () => clearTimeout(t);
  }, [value, language, socket, projectId, projectData]);

  // Receive code changes from collaborators
  useEffect(() => {
    if (!socket) return;
    const handler = (receivedCode) => {
      if (receivedCode !== lastReceivedCode.current) {
        lastReceivedCode.current = receivedCode;
        onChange(receivedCode);
      }
    };
    socket.on("receive_code_change", handler);
    return () => socket.off("receive_code_change", handler);
  }, [socket, onChange]);

  const handleEditorChange = (newValue) => {
    onChange(newValue);
    socket?.emit("code_change", { projectId, newCode: newValue });
  };

  const handleRunCode = async () => {
    if (!value || isRunning) return;
    setIsRunning(true);

    writeOutput(`\r\n\x1b[33m▶ Running ${language}...\x1b[0m\r\n`);

    try {
      const res = await fetch(`${COMPILER_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code: value, input: "" }),
      });
      const data = await res.json();

      if (data.error) {
        writeOutput(`\x1b[31m${data.error}\x1b[0m\r\n`);
      } else {
        writeOutput(`\x1b[32m${data.result || "(no output)"}\x1b[0m\r\n`);
      }
    } catch (err) {
      writeOutput(
        `\x1b[31mFailed to reach compiler service: ${err.message}\x1b[0m\r\n`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--as-bg3)",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 0.875rem",
          flexShrink: 0,
          background: "var(--as-bg2)",
          borderBottom: "1px solid var(--as-border)",
        }}
      >
        <select
          value={language}
          onChange={handleLanguageChange}
          style={{
            height: 30,
            padding: "0 0.625rem",
            background: "var(--as-bg3)",
            border: "1px solid var(--as-border2)",
            borderRadius: "var(--as-radius-sm)",
            fontFamily: "var(--as-font-mono)",
            fontSize: "0.78rem",
            color: "var(--as-text2)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={handleRunCode}
          disabled={isRunning}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            height: 30,
            padding: "0 0.875rem",
            borderRadius: "var(--as-radius-full)",
            border: "1px solid rgba(74,222,128,0.25)",
            background: isRunning
              ? "rgba(74,222,128,0.3)"
              : "rgba(74,222,128,0.15)",
            color: "var(--as-green)",
            fontFamily: "var(--as-font-body)",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: isRunning ? "not-allowed" : "pointer",
            opacity: isRunning ? 0.7 : 1,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!isRunning)
              e.currentTarget.style.background = "rgba(74,222,128,0.25)";
          }}
          onMouseLeave={(e) => {
            if (!isRunning)
              e.currentTarget.style.background = "rgba(74,222,128,0.15)";
          }}
        >
          <Play size={12} />
          {isRunning ? "Running…" : "Run"}
        </button>
      </div>

      {/* Monaco */}
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <Editor
          language={language}
          theme="vs-dark"
          value={value}
          onChange={handleEditorChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            fontFamily: "var(--as-font-mono)",
          }}
          beforeMount={(monaco) => {
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: false,
                noSyntaxValidation: false,
              },
            );
          }}
        />
      </div>
    </div>
  );
}
