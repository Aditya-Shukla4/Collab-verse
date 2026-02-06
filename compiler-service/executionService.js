import { promises as fs } from "fs";
import { exec } from "child_process";
import path from "path";

const TEMP_DIR = path.join(process.cwd(), "temp_code");
const EXECUTION_TIMEOUT = 5000;

const initializeTempDir = async () => {
  await fs.mkdir(TEMP_DIR, { recursive: true });
};
initializeTempDir();

const runPython = async (code, input) => {
  const uniqueId =
    Date.now().toString() + Math.random().toString(36).substring(2, 8);
  const codeFileName = path.join(TEMP_DIR, `${uniqueId}.py`);
  const inputFileName = path.join(TEMP_DIR, `${uniqueId}.txt`);
  let filesCreated = false;
  try {
    await fs.writeFile(codeFileName, code);
    await fs.writeFile(inputFileName, input);
    filesCreated = true;
    const command = `python3 ${codeFileName} < ${inputFileName}`;
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        command,
        { timeout: EXECUTION_TIMEOUT, shell: true },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              return reject({
                error: `Execution Timeout: Code ran longer than ${EXECUTION_TIMEOUT}ms.`,
              });
            }
            return reject({ error: stderr || stdout || error.message });
          }
          resolve({ stdout, stderr });
        },
      );
    });
    if (stderr) return { error: stderr };
    return { result: stdout.trim() };
  } catch (err) {
    return {
      error:
        typeof err === "object" && err.error
          ? err.error
          : `Compiler Service Error: ${
              err.message || "An unknown error occurred."
            }`,
    };
  } finally {
    if (filesCreated) {
      try {
        await Promise.all([fs.unlink(codeFileName), fs.unlink(inputFileName)]);
      } catch (cleanupErr) {
        console.error(
          `Failed to clean up Python files for ID ${uniqueId}:`,
          cleanupErr,
        );
      }
    }
  }
};

const runCpp = async (code, input) => {
  const uniqueId =
    Date.now().toString() + Math.random().toString(36).substring(2, 8);
  const codeFileName = path.join(TEMP_DIR, `${uniqueId}.cpp`);
  const inputFileName = path.join(TEMP_DIR, `${uniqueId}.txt`);
  const executableFileName = path.join(TEMP_DIR, `${uniqueId}.out`);
  let filesCreated = false;

  try {
    await fs.writeFile(codeFileName, code);
    await fs.writeFile(inputFileName, input);
    filesCreated = true;

    const compileCommand = `g++ ${path.basename(
      codeFileName,
    )} -o ${path.basename(executableFileName)}`;
    await new Promise((resolve, reject) => {
      exec(
        compileCommand,
        { timeout: EXECUTION_TIMEOUT, cwd: TEMP_DIR },
        (error, stdout, stderr) => {
          if (error) {
            return reject({ error: stderr || "Compilation Failed." });
          }
          resolve();
        },
      );
    });

    await fs.chmod(executableFileName, 0o755);

    const runCommand = `./${path.basename(
      executableFileName,
    )} < ./${path.basename(inputFileName)}`;
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        runCommand,
        { timeout: EXECUTION_TIMEOUT, cwd: TEMP_DIR },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              return reject({
                error: `Execution Timeout: Code ran longer than ${EXECUTION_TIMEOUT}ms.`,
              });
            }
            return reject({ error: stderr || stdout || error.message });
          }
          resolve({ stdout, stderr });
        },
      );
    });

    return { result: stdout.trim() };
  } catch (err) {
    return {
      error:
        typeof err === "object" && err.error
          ? err.error
          : `Compiler Service Error: ${
              err.message || "An unknown error occurred."
            }`,
    };
  } finally {
    if (filesCreated) {
      try {
        await Promise.all([
          fs.unlink(codeFileName),
          fs.unlink(inputFileName),
          fs.unlink(executableFileName).catch(() => {}),
        ]);
      } catch (cleanupErr) {
        console.error(
          `Failed to clean up C++ files for ID ${uniqueId}:`,
          cleanupErr,
        );
      }
    }
  }
};

const runC = async (code, input) => {
  const uniqueId =
    Date.now().toString() + Math.random().toString(36).substring(2, 8);
  const codeFileName = path.join(TEMP_DIR, `${uniqueId}.c`);
  const inputFileName = path.join(TEMP_DIR, `${uniqueId}.txt`);
  const executableFileName = path.join(TEMP_DIR, `${uniqueId}.out`);
  let filesCreated = false;

  try {
    await fs.writeFile(codeFileName, code);
    await fs.writeFile(inputFileName, input);
    filesCreated = true;

    const compileCommand = `gcc ${path.basename(
      codeFileName,
    )} -o ${path.basename(executableFileName)}`;
    await new Promise((resolve, reject) => {
      exec(
        compileCommand,
        { timeout: EXECUTION_TIMEOUT, cwd: TEMP_DIR },
        (error, stdout, stderr) => {
          if (error) {
            return reject({ error: stderr || "Compilation Failed." });
          }
          resolve();
        },
      );
    });

    await fs.chmod(executableFileName, 0o755);

    const runCommand = `./${path.basename(
      executableFileName,
    )} < ./${path.basename(inputFileName)}`;
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        runCommand,
        { timeout: EXECUTION_TIMEOUT, cwd: TEMP_DIR },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              return reject({
                error: `Execution Timeout: Code ran longer than ${EXECUTION_TIMEOUT}ms.`,
              });
            }
            return reject({ error: stderr || stdout || error.message });
          }
          resolve({ stdout, stderr });
        },
      );
    });

    return { result: stdout.trim() };
  } catch (err) {
    return {
      error:
        typeof err === "object" && err.error
          ? err.error
          : `Compiler Service Error: ${
              err.message || "An unknown error occurred."
            }`,
    };
  } finally {
    if (filesCreated) {
      try {
        await Promise.all([
          fs.unlink(codeFileName),
          fs.unlink(inputFileName),
          fs.unlink(executableFileName).catch(() => {}),
        ]);
      } catch (cleanupErr) {
        console.error(
          `Failed to clean up C files for ID ${uniqueId}:`,
          cleanupErr,
        );
      }
    }
  }
};

const runJava = async (code, input) => {
  const uniqueId =
    Date.now().toString() + Math.random().toString(36).substring(2, 8);
  const workDir = path.join(TEMP_DIR, uniqueId);
  await fs.mkdir(workDir, { recursive: true });
  const codeFileName = path.join(workDir, `Main.java`);
  const inputFileName = path.join(workDir, `input.txt`);
  let filesCreated = false;
  try {
    await fs.writeFile(codeFileName, code);
    await fs.writeFile(inputFileName, input);
    filesCreated = true;
    const compileCommand = `javac ${codeFileName}`;
    await new Promise((resolve, reject) => {
      exec(
        compileCommand,
        { timeout: EXECUTION_TIMEOUT },
        (error, stdout, stderr) => {
          if (error) {
            return reject({ error: stderr || "Compilation Failed." });
          }
          resolve();
        },
      );
    });
    const runCommand = `java Main < input.txt`;
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        runCommand,
        { timeout: EXECUTION_TIMEOUT, cwd: workDir },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              return reject({
                error: `Execution Timeout: Code ran longer than ${EXECUTION_TIMEOUT}ms.`,
              });
            }
            return reject({ error: stderr || stdout || error.message });
          }
          resolve({ stdout, stderr });
        },
      );
    });
    return { result: stdout.trim() };
  } catch (err) {
    return {
      error:
        typeof err === "object" && err.error
          ? err.error
          : `Compiler Service Error: ${
              err.message || "An unknown error occurred."
            }`,
    };
  } finally {
    if (filesCreated) {
      try {
        await fs.rm(workDir, { recursive: true, force: true });
      } catch (cleanupErr) {
        console.error(
          `Failed to clean up Java files for ID ${uniqueId}:`,
          cleanupErr,
        );
      }
    }
  }
};

const runGo = async (code, input) => {
  const uniqueId =
    Date.now().toString() + Math.random().toString(36).substring(2, 8);
  const codeFileName = path.join(TEMP_DIR, `${uniqueId}.go`);
  const inputFileName = path.join(TEMP_DIR, `${uniqueId}.txt`);
  let filesCreated = false;

  try {
    await fs.writeFile(codeFileName, code);
    await fs.writeFile(inputFileName, input);
    filesCreated = true;

    const command = `go run ${codeFileName} < ${inputFileName}`;

    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        command,
        { timeout: EXECUTION_TIMEOUT, shell: true },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              return reject({
                error: `Execution Timeout: Code ran longer than ${EXECUTION_TIMEOUT}ms.`,
              });
            }
            return reject({ error: stderr || stdout || error.message });
          }
          resolve({ stdout, stderr });
        },
      );
    });

    if (stderr) return { error: stderr };
    return { result: stdout.trim() };
  } catch (err) {
    return {
      error:
        typeof err === "object" && err.error
          ? err.error
          : `Compiler Service Error: ${
              err.message || "An unknown error occurred."
            }`,
    };
  } finally {
    if (filesCreated) {
      try {
        await Promise.all([fs.unlink(codeFileName), fs.unlink(inputFileName)]);
      } catch (cleanupErr) {
        console.error(
          `Failed to clean up Go files for ID ${uniqueId}:`,
          cleanupErr,
        );
      }
    }
  }
};

const runPhp = async (code, input) => {
  const uniqueId =
    Date.now().toString() + Math.random().toString(36).substring(2, 8);
  const codeFileName = path.join(TEMP_DIR, `${uniqueId}.php`);
  const inputFileName = path.join(TEMP_DIR, `${uniqueId}.txt`);
  let filesCreated = false;

  try {
    await fs.writeFile(codeFileName, code);
    await fs.writeFile(inputFileName, input);
    filesCreated = true;

    const command = `php ${codeFileName} < ${inputFileName}`;

    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        command,
        { timeout: EXECUTION_TIMEOUT, shell: true },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              return reject({
                error: `Execution Timeout: Code ran longer than ${EXECUTION_TIMEOUT}ms.`,
              });
            }
            return reject({ error: stderr || stdout || error.message });
          }
          resolve({ stdout, stderr });
        },
      );
    });

    if (stderr) return { error: stderr };
    return { result: stdout.trim() };
  } catch (err) {
    return {
      error:
        typeof err === "object" && err.error
          ? err.error
          : `Compiler Service Error: ${
              err.message || "An unknown error occurred."
            }`,
    };
  } finally {
    if (filesCreated) {
      try {
        await Promise.all([fs.unlink(codeFileName), fs.unlink(inputFileName)]);
      } catch (cleanupErr) {
        console.error(
          `Failed to clean up PHP files for ID ${uniqueId}:`,
          cleanupErr,
        );
      }
    }
  }
};

const runRust = async (code, input) => {
  const uniqueId =
    Date.now().toString() + Math.random().toString(36).substring(2, 8);
  const codeFileName = path.join(TEMP_DIR, `${uniqueId}.rs`);
  const inputFileName = path.join(TEMP_DIR, `${uniqueId}.txt`);
  const executableFileName = path.join(TEMP_DIR, uniqueId);
  let filesCreated = false;

  try {
    await fs.writeFile(codeFileName, code);
    await fs.writeFile(inputFileName, input);
    filesCreated = true;

    const compileCommand = `rustc ${path.basename(
      codeFileName,
    )} -o ${path.basename(executableFileName)}`;
    await new Promise((resolve, reject) => {
      exec(
        compileCommand,
        { timeout: EXECUTION_TIMEOUT, cwd: TEMP_DIR },
        (error, stdout, stderr) => {
          if (error) {
            return reject({ error: stderr || "Compilation Failed." });
          }
          resolve();
        },
      );
    });

    await fs.chmod(executableFileName, 0o755);

    const runCommand = `./${path.basename(
      executableFileName,
    )} < ./${path.basename(inputFileName)}`;
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(
        runCommand,
        { timeout: EXECUTION_TIMEOUT, cwd: TEMP_DIR },
        (error, stdout, stderr) => {
          if (error) {
            if (error.killed) {
              return reject({
                error: `Execution Timeout: Code ran longer than ${EXECUTION_TIMEOUT}ms.`,
              });
            }
            return reject({ error: stderr || stdout || error.message });
          }
          resolve({ stdout, stderr });
        },
      );
    });

    return { result: stdout.trim() };
  } catch (err) {
    return {
      error:
        typeof err === "object" && err.error
          ? err.error
          : `Compiler Service Error: ${
              err.message || "An unknown error occurred."
            }`,
    };
  } finally {
    if (filesCreated) {
      try {
        await Promise.all([
          fs.unlink(codeFileName),
          fs.unlink(inputFileName),
          fs.unlink(executableFileName).catch(() => {}),
        ]);
      } catch (cleanupErr) {
        console.error(
          `Failed to clean up Rust files for ID ${uniqueId}:`,
          cleanupErr,
        );
      }
    }
  }
};

export { runPython, runCpp, runC, runJava, runGo, runPhp, runRust };
