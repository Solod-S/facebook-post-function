function logInfo(...args) {
  console.log("[INFO]", ...args);
}

function logError(...args) {
  console.error("[ERROR]", ...args);
}

module.exports = { logInfo, logError };
