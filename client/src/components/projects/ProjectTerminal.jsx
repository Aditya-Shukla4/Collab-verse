"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const TERMINAL_SERVER_URL =
  process.env.NEXT_PUBLIC_COMPILER_API_URL || "http://localhost:6001";

export default function ProjectTerminal({ projectId, setTerminalRunner }) {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current || !projectId) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#1a1b26",
        foreground: "#cbced3",
        cursor: "#c0c5f7",
      },
      fontSize: 14,
      fontFamily: "monospace",
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch (e) {
        console.warn("FitAddon resize failed.");
      }
    });
    resizeObserver.observe(terminalRef.current);

    const socket = io(TERMINAL_SERVER_URL);
    let currentCallback = null;

    socket.on("connect", () => {
      console.log(`✅ Connected to Terminal Server: ${socket.id}`);
      socket.emit("terminal:join", projectId);

      const commandRunner = (command, callback) => {
        if (socket.connected) {
          term.write("\x1b[2J\x1b[H"); // Clear screen
          currentCallback = callback; // Callback ko store kar lo

          // Command ke aakhir me completion signal daal kar bhejo
          const commandWithSignal = `${command.slice(
            0,
            -1
          )}; echo "--CMD_COMPLETE--"\n`;
          socket.emit("terminal:write", { projectId, data: commandWithSignal });
        }
      };
      setTerminalRunner(() => commandRunner);
    });

    const onDataHandler = (data) => term.write(data);
    socket.on("terminal:data", onDataHandler);

    // Jab backend se 'cmd_done' ka signal aaye, tab callback chalao
    const onCmdDoneHandler = () => {
      if (currentCallback) {
        currentCallback();
        currentCallback = null; // Callback ko reset kar do taaki baar-baar na chale
      }
    };
    socket.on("terminal:cmd_done", onCmdDoneHandler);

    // Jab user type kare, toh raw data bhejo, bina signal ke
    const onUserInput = term.onData((data) => {
      socket.emit("terminal:write", { projectId, data });
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected from Terminal Server.`);
      term.write("\r\n\r\n--- DISCONNECTED ---\r\n");
      setTerminalRunner(null);
    });

    // --- Cleanup ---
    return () => {
      resizeObserver.disconnect();
      socket.disconnect();
      socket.off("terminal:cmd_done", onCmdDoneHandler); // Listener ko aache se hatao
      onUserInput.dispose();
      term.dispose();
    };
  }, [projectId, setTerminalRunner]);

  return (
    <div className="bg-[#1a1b26] p-2 h-full w-full" ref={terminalRef}>
      {/* Terminal renders here */}
    </div>
  );
}
