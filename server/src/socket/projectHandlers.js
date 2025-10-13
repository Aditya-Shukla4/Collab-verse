// server/src/socket/projectHandlers.js (Conceptual Socket Handler File)

const { executeCode } = require("../services/compilerService");

module.exports = (io, socket) => {
  // ... existing save_code and code_change listeners ...

  // NEW LISTENER FOR CODE EXECUTION
  socket.on("execute_code", ({ projectId, code }) => {
    console.log(`Executing code for project ${projectId}...`);

    // 1. Run the code using our simple service
    const executionResult = executeCode(code);

    // 2. Send the result back to the user who requested the run
    socket.emit("code_execution_result", executionResult);

    // OPTIONAL: Send the result to ALL users in the project room
    // io.to(projectId).emit('code_execution_result', executionResult);
    // We usually only send the result to the user who ran it to avoid spamming everyone.
  });
};
