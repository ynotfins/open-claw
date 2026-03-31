const { execFile } = require("child_process");
const { promisify } = require("util");

const execFileAsync = promisify(execFile);

async function runAgent({ message, sessionId }) {
  const args = ["agent", "--agent", "main", "--session-id", sessionId, "--message", message];
  const { stdout } = await execFileAsync("openclaw", args, { maxBuffer: 1024 * 1024 });
  return (stdout || "").trim();
}

module.exports = { runAgent };
