const http = require("http");
const { Worker } = require("worker_threads");

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/":
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("Home page");
    case "/slow":
      const worker = new Worker("./worker.js");

      worker.on("message", (data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(data.msg);
      });

      worker.on("error", (error) => {
        console.error(error);
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end("Error");
      });
      break;
    default:
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Not Found");
  }
});

const port = parseInt(process.env.PORT) || 9000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// master module => create new workers run instances of nodejs app

// 1 nodejs instance = 1 main thread + event loop + memory + ...
// worker threads => in an nodejs instance => create a new worker thread = 1 thread + 1 event loop + memory + ...
// task in main thread if cpu extensive or time-consuming => assign to worker thread to handle, so that
// main thread can perform other operations like handle other http requests
// cluster => responsible for creating new nodejs instance

// each nodejs instance has a process
// main thread + livuv
// libuv provides some extra hidden threads in the background to handle I/O operations
