"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function CodeEditor({
  value,
  onChange,
  projectId,
  projectData,
  onRunCommand,
}) {
  const socket = useSocket();
  const [language, setLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const lastReceivedCode = useRef(null);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(`lang-${projectId}`);
      if (savedLang) setLanguage(savedLang);
      else if (projectData?.codeLanguage) setLanguage(projectData.codeLanguage);
    } catch (e) {
      console.warn("localStorage not available");
    }
  }, [projectData, projectId]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    try {
      localStorage.setItem(`lang-${projectId}`, newLang);
    } catch (e) {
      console.warn("localStorage not available");
    }
    socket?.emit("save_code", { projectId, newCode: value, language: newLang });
  };

  useEffect(() => {
    if (!projectData) return;
    const timer = setTimeout(() => {
      socket?.emit("save_code", { projectId, newCode: value, language });
    }, 1500);
    return () => clearTimeout(timer);
  }, [value, language, socket, projectId, projectData]);

  useEffect(() => {
    if (!socket) return;
    const handleCodeReceive = (receivedCode) => {
      if (receivedCode !== lastReceivedCode.current) {
        lastReceivedCode.current = receivedCode;
        onChange(receivedCode);
      }
    };
    socket.on("receive_code_change", handleCodeReceive);
    return () => socket.off("receive_code_change", handleCodeReceive);
  }, [socket, onChange]);

  const handleEditorChange = (newValue) => {
    onChange(newValue);
    socket?.emit("code_change", { projectId, newCode: newValue });
  };

  const handleRunCode = () => {
    if (!onRunCommand || !value || isRunning) return;

    setIsRunning(true);

    const tempFile = `temp_run_${Date.now()}`;

    const createFileAndRun = (fileName, runCmd, cleanupCmd) => {
      const cleanup = cleanupCmd || `rm -f ${fileName}`;

      // 💥 FIX: Use btoa() for browser-safe Base64 encoding 💥
      // Buffer does not exist in the browser. We also handle Unicode correctly.
      const base64Code = btoa(unescape(encodeURIComponent(value)));

      const shellScript = `echo '${base64Code}' | base64 -d > ${fileName} && ${runCmd} && ${cleanup}`;

      return shellScript;
    };

    let command;
    try {
      switch (language) {
        case "python":
          command = createFileAndRun(
            `${tempFile}.py`,
            `python3 ${tempFile}.py`
          );
          break;
        case "javascript":
          command = createFileAndRun(`${tempFile}.js`, `node ${tempFile}.js`);
          break;
        case "c":
          command = createFileAndRun(
            `${tempFile}.c`,
            `gcc ${tempFile}.c -o ${tempFile}.out 2>&1 && ./${tempFile}.out`,
            `rm -f ${tempFile}.c ${tempFile}.out`
          );
          break;
        case "cpp":
          command = createFileAndRun(
            `${tempFile}.cpp`,
            `g++ ${tempFile}.cpp -o ${tempFile}.out 2>&1 && ./${tempFile}.out`,
            `rm -f ${tempFile}.cpp ${tempFile}.out`
          );
          break;
        case "java":
          command = createFileAndRun(
            `Main.java`,
            `javac Main.java 2>&1 && java Main`,
            `rm -f Main.java Main.class`
          );
          break;
        case "go":
          command = createFileAndRun(`${tempFile}.go`, `go run ${tempFile}.go`);
          break;
        case "php":
          command = createFileAndRun(`${tempFile}.php`, `php ${tempFile}.php`);
          break;
        case "rust":
          command = createFileAndRun(
            `${tempFile}.rs`,
            `rustc ${tempFile}.rs -o ${tempFile}.out 2>&1 && ./${tempFile}.out`,
            `rm -f ${tempFile}.rs ${tempFile}.out`
          );
          break;
        default:
          console.error("Unsupported language for terminal execution");
          setIsRunning(false);
          return;
      }

      const timeoutId = setTimeout(() => {
        setIsRunning(false);
      }, 30000); // 30 second timeout

      onRunCommand(command, () => {
        clearTimeout(timeoutId);
        setIsRunning(false);
      });
    } catch (error) {
      console.error("Error running code:", error);
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="flex justify-between items-center p-2 bg-zinc-950 border-b border-zinc-700 flex-shrink-0">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="p-1 border border-zinc-700 bg-zinc-800 text-white rounded text-sm"
        >
          <option value="javascript">JavaScript</option>
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
          className={`bg-green-600 hover:bg-green-700 text-white flex items-center ${
            isRunning ? "opacity-60 cursor-not-allowed" : ""
          }`}
          disabled={isRunning}
        >
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? "Running..." : "Run in Terminal"}
        </Button>
      </div>

      <div className="flex-grow w-full h-full">
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
          }}
          beforeMount={(monaco) => {
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions(
              {
                noSemanticValidation: false,
                noSyntaxValidation: false,
              }
            );
          }}
        />
      </div>
    </div>
  );
}
