import pty from "node-pty";

const terminals = {};
const shell = "bash";

export const createTerminal = (projectId, io) => {
  if (terminals[projectId]) {
    console.log(`♻️ Terminal for project ${projectId} already exists.`);
    return;
  }

  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd: process.cwd(),
    env: process.env,
  });

  console.log(
    `🚀 Created terminal for project ${projectId} with PID: ${ptyProcess.pid}`
  );
  terminals[projectId] = { process: ptyProcess };

  ptyProcess.onData((data) => {
    // Check for our custom completion signal
    if (data.includes("--CMD_COMPLETE--")) {
      io.to(projectId).emit("terminal:cmd_done");
      // Clean the signal from the output before sending to the user
      const cleanData = data.replace(/.*--CMD_COMPLETE--.*\s*$/, "");
      if (cleanData) {
        io.to(projectId).emit("terminal:data", cleanData);
      }
    } else {
      io.to(projectId).emit("terminal:data", data);
    }
  });

  ptyProcess.onExit(({ exitCode }) => {
    console.log(
      `🔻 Terminal for project ${projectId} exited with code ${exitCode}`
    );
    io.to(projectId).emit(
      "terminal:data",
      "\r\n\r\n--- TERMINAL SESSION ENDED ---\r\n"
    );
    delete terminals[projectId];
  });
};

/**
 * Writes data directly to the terminal process.
 * This function is now "dumb" and just passes data through.
 */
export const writeToTerminal = (projectId, data) => {
  const term = terminals[projectId];
  if (term && term.process && data) {
    term.process.write(data);
  }
};

export const killTerminalOnDisconnect = (socket, io) => {
  for (const projectId in terminals) {
    const room = io.sockets.adapter.rooms.get(projectId);
    if (!room || room.size === 0) {
      console.log(
        `🚮 No users left in terminal room ${projectId}, killing terminal.`
      );
      terminals[projectId].process.kill();
      delete terminals[projectId];
    }
  }
};
