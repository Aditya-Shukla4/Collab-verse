"use client";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

const TERMINAL_SERVER_URL =
  process.env.NEXT_PUBLIC_COMPILER_API_URL || "http://localhost:6001";

export default function ProjectTerminal({
  projectId,
  setTerminalRunner,
  terminalWriterRef,
}) {
  const outerRef = useRef(null); // measured container
  const innerRef = useRef(null); // xterm mounts here
  const setRunnerRef = useRef(setTerminalRunner);
  const termRef = useRef(null); // xterm instance ref

  useEffect(() => {
    setRunnerRef.current = setTerminalRunner;
  }, [setTerminalRunner]);

  // Register direct write function so CodeEditor can write output straight into terminal
  useEffect(() => {
    if (terminalWriterRef) {
      terminalWriterRef.current = (text) => {
        if (termRef.current) termRef.current.write(text);
      };
    }
  });

  useEffect(() => {
    if (!outerRef.current || !innerRef.current || !projectId) return;

    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: "#0d0d18",
        foreground: "#8888a8",
        cursor: "#6c63ff",
        selectionBackground: "rgba(108,99,255,0.25)",
        black: "#080810",
        brightBlack: "#44445a",
        cyan: "#4ecdc4",
        brightCyan: "#4ecdc4",
        green: "#4ade80",
        brightGreen: "#4ade80",
        red: "#ff6b6b",
        brightRed: "#ff6b6b",
        yellow: "#ffd93d",
        white: "#eeeef5",
      },
      fontSize: 13,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      convertEol: true,
      lineHeight: 1.4,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(innerRef.current);
    termRef.current = term; // expose to writer

    // Fit after a tick so the DOM has settled
    const doFit = () => {
      try {
        fitAddon.fit();
      } catch {}
    };
    requestAnimationFrame(doFit);

    // Re-fit whenever the OUTER container changes size
    const ro = new ResizeObserver(doFit);
    ro.observe(outerRef.current);

    const socket = io(TERMINAL_SERVER_URL);
    let currentCallback = null;

    socket.on("connect", () => {
      socket.emit("terminal:join", projectId);
      setRunnerRef.current(() => (command, callback) => {
        if (!socket.connected) return;
        term.write("\x1b[2J\x1b[H");
        currentCallback = callback;
        socket.emit("terminal:write", {
          projectId,
          data: `${command.slice(0, -1)}; echo "--CMD_COMPLETE--"\n`,
        });
      });
    });

    const onData = (data) => term.write(data);
    const onCmdDone = () => {
      if (currentCallback) {
        currentCallback();
        currentCallback = null;
      }
    };
    socket.on("terminal:data", onData);
    socket.on("terminal:cmd_done", onCmdDone);

    const onUserInput = term.onData((data) =>
      socket.emit("terminal:write", { projectId, data }),
    );

    socket.on("disconnect", () => {
      term.write("\r\n\r\n\x1b[31m--- DISCONNECTED ---\x1b[0m\r\n");
      setRunnerRef.current(null);
    });

    return () => {
      ro.disconnect();
      socket.off("terminal:data", onData);
      socket.off("terminal:cmd_done", onCmdDone);
      socket.disconnect();
      onUserInput.dispose();
      termRef.current = null;
      term.dispose();
    };
  }, [projectId]);

  return (
    /*
      outerRef  — the "viewport": full panel size, clips everything
      innerRef  — where xterm mounts its canvas; absolutely fills outerRef
    */
    <div
      ref={outerRef}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden" /* hard-clips the canvas */,
        background: "#0d0d18",
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          inset: 0,
          padding: "4px",
        }}
      />
    </div>
  );
}
