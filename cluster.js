const cluster = require("cluster");
const http = require("http");
const os = require("os");
const { join } = require("path");

// console.log(os.cpus().length);

// if (cluster.isMaster) {
//   console.log(`Master process ${process.pid} is running`);
//   cluster.fork();
//   cluster.fork();
// } else {
//   console.log(`Worker ${process.pid} started`);
//   const server = http.createServer((req, res) => {
//     switch (req.url) {
//       case "/":
//         res.writeHead(200, { "Content-Type": "text/plain" });
//         return res.end("Home page");
//       case "/slow":
//         for (let i = 0; i < 6000000000; i++) {}
//         res.writeHead(200, { "Content-Type": "text/plain" });
//         return res.end("Slow page");
//       default:
//         return res.end("Not found");
//     }
//   });

//   const port = parseInt(process.env.PORT) || 9000;
//   server.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
//   });
// }

const cpuCount = os.cpus().length;

console.log(`Total nummber of CPUs is ${cpuCount}`);
console.log(`Primany pid is ${process.pid}`);

cluster.setupPrimary({
  exec: join(__dirname, "index.js"),
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}

cluster.on("online", (worker, code, signal) => {
  console.log(`work with pid ${worker.process.pid} is up and running!`);
});

cluster.on("exit", (worker, code, signal) => {
  console.log(`work with pid ${worker.process.pid} has been killed!`);
  console.log("Start another worker");

  cluster.fork();
});
