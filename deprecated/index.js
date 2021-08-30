var io = require("socket.io")({
  transports: ["websocket"],
});

io.attach(3000);

const Packet = require("../src/Packet");
const handlers = require("../src/Handlers");

console.log("Server Initialized 3000");

io.on("connection", function (socket) {
  var packet = new Packet();
});

io.on("message", function (socket) {
  console.log("aeaeae");
});
