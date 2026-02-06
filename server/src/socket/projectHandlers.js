const { executeCode } = require("../services/compilerService");

module.exports = (io, socket) => {
  socket.on("execute_code", ({ projectId, code }) => {
    console.log(`Executing code for project ${projectId}...`);

    const executionResult = executeCode(code);
    socket.emit("code_execution_result", executionResult);
  });
};
