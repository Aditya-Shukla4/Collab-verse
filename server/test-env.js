import dotenv from 'dotenv';
dotenv.config();

console.log("--- Starting Environment Test ---");
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("--- Test Finished ---");   