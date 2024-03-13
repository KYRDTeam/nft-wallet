const { exec } = require("child_process");

exec("yarn find-deadcode", (_, stdout) => {
  console.log(stdout);
  const hasFailure = stdout.split("\n").find((line) => line.startsWith("src/"));

  process.exit(hasFailure ? 1 : 0);
});
