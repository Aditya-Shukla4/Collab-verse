// compiler-service/index.js

import express from "express";
import cors from "cors";
// CRITICAL IMPORT: Ensure both functions are imported
import {
  runPython,
  runCpp,
  runC,
  runJava,
  runGo,
  runPhp,
  runRust,
} from "./executionService.js";

const app = express();
// Use a different port than the main server (e.g., 6000)
const PORT = 6000;

// Middleware
app.use(express.json());
app.use(cors());

// 🚀 CRITICAL API ENDPOINT 🚀
// compiler-service/index.js

app.post("/api/run", async (req, res) => {
  const { code, input, language } = req.body;

  if (!code || !language) {
    return res
      .status(400)
      .json({ error: "Missing code or language parameter." });
  }

  let executionResult;
  try {
    if (language === "python") {
      executionResult = await runPython(code, input);
    } else if (language === "c") {
      executionResult = await runC(code, input);
    } else if (language === "cpp") {
      executionResult = await runCpp(code, input);
    } else if (language === "java") {
      executionResult = await runJava(code, input);
    } else if (language === "go") {
      executionResult = await runGo(code, input);
    } else if (language === "php") {
      executionResult = await runPhp(code, input);
    } else if (language === "rust") {
      executionResult = await runRust(code, input);
    } else {
      executionResult = {
        error: `Unsupported language: ${language.toUpperCase()}`,
      };
    }
    return res.json(executionResult);
  } catch (err) {
    console.error(`Compiler API Error for ${language}:`, err);
    return res
      .status(500)
      .json({ error: "Internal compiler error occurred during execution." });
  }
});
app.listen(PORT, () => {
  console.log(`[MICROSERVICE] Compiler running on port ${PORT}`);
});
