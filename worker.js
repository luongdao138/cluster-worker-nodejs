const { parentPort } = require("worker_threads");

for (let i = 0; i < 6_000_000_000; i++) {}

parentPort.postMessage({ msg: "from worker" });
