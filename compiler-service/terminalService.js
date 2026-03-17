// server/src/services/socket/terminalService.js
import pty from "node-pty";
import { exec } from "child_process";

const terminals = {};

export const createTerminal = (projectId, io) => {
  if (terminals[projectId]) {
    console.log(`♻️ Terminal for project ${projectId} already exists.`);
    return;
  }

  const containerName = `collab-term-${projectId}`;

  // MAGIC TRICK: cmd.exe HATA DIYA! Ab hum seedha Docker container spawn kar rahe hain!
  // -it = interactive terminal
  // --rm = container close hote hi auto-delete
  const ptyProcess = pty.spawn(
    "docker",
    [
      "run",
      "-it",
      "--rm",
      "--name",
      containerName,
      "ubuntu:22.04", // Ek fresh Ubuntu Linux machine har project ke liye!
      "/bin/bash",
    ],
    {
      name: "xterm-color",
      cols: 80,
      rows: 24,
      cwd: process.cwd(),
      env: process.env,
    },
  );

  console.log(
    `🚀 Created SECURE Docker terminal for project ${projectId} with PID: ${ptyProcess.pid}`,
  );

  // Container ka naam bhi save kar rahe hain taaki baad me force-kill kar sakein
  terminals[projectId] = { process: ptyProcess, containerName };

  ptyProcess.onData((data) => {
    if (data.includes("--CMD_COMPLETE--")) {
      io.to(projectId).emit("terminal:cmd_done");
      const cleanData = data.replace(/.*--CMD_COMPLETE--.*\s*$/, "");
      if (cleanData) io.to(projectId).emit("terminal:data", cleanData);
    } else {
      io.to(projectId).emit("terminal:data", data);
    }
  });

  ptyProcess.onExit(({ exitCode }) => {
    console.log(
      `🔻 Docker Terminal for project ${projectId} exited with code ${exitCode}`,
    );
    io.to(projectId).emit(
      "terminal:data",
      "\r\n\r\n--- TERMINAL SESSION ENDED ---\r\n",
    );
    delete terminals[projectId];

    // Safety cleanup: Agar container atak gaya toh usko force remove kar do
    exec(`docker rm -f ${containerName}`, () => {});
  });
};

export const writeToTerminal = (projectId, data) => {
  const term = terminals[projectId];
  if (term && term.process && data) term.process.write(data);
};

export const killTerminalOnDisconnect = (socket, io) => {
  for (const projectId in terminals) {
    const room = io.sockets.adapter.rooms.get(projectId);
    if (!room || room.size === 0) {
      console.log(
        `🚮 No users left in room ${projectId}, killing Docker terminal.`,
      );
      const term = terminals[projectId];
      if (term) {
        term.process.kill();
        // Container ko garbage collector me daal do
        exec(`docker rm -f ${term.containerName}`, () => {});
        delete terminals[projectId];
      }
    }
  }
};
