// server/src/services/compilerService.js

import vm from "vm";

// Time limit for code execution in milliseconds (e.g., 2 seconds)
const TIME_LIMIT = 2000;

/**
 * Executes a JavaScript code string in a safe, isolated context (vm).
 * @param {string} codeString The user-submitted code to execute.
 * @param {string} inputString The user-provided input data.
 * @returns {object} { result: string } or { error: string }
 */
const executeCode = (codeString, inputString = "") => {
  let capturedOutput = "";

  // Prepare input: Filter out lines that are only whitespace, then split by lines.
  const allInputLines = inputString.split("\n");
  // CRITICAL IMPROVEMENT: Only keep lines with actual content
  const inputLines = allInputLines.filter((line) => line.trim().length > 0);
  let inputIndex = 0;

  const sandbox = {
    console: {
      log: (...args) => {
        capturedOutput += args.map(String).join(" ") + "\n";
      },
    },

    // 💥 ROBUST getInput(): Reads only non-empty lines, returns empty string when finished 💥
    getInput: () => {
      if (inputIndex >= inputLines.length) {
        return ""; // Returns empty string for Number() to convert to 0 gracefully
      }
      // Return the line, but trim it one last time just in case.
      return inputLines[inputIndex++].trim();
    },

    setTimeout: undefined,
    setInterval: undefined,
  };

  const context = vm.createContext(sandbox);

  try {
    vm.runInContext(`(function() { ${codeString} })();`, context, {
      timeout: TIME_LIMIT,
      displayErrors: true,
    });

    return {
      result: capturedOutput || "Execution successful (No console output).",
    };
  } catch (error) {
    if (error.code === "ERR_SCRIPT_EXECUTION_TIMEOUT") {
      return {
        error: `Execution Timeout: Code took longer than ${TIME_LIMIT}ms to run. (Possible infinite loop)`,
      };
    }
    return { error: error.message };
  }
};

export { executeCode };
