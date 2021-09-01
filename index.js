//#region PROPERTIES
var WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({ port: 3000 });

const User = require("./src/User");
const { Handle, rooms } = require("./src/Handlers");
const UniqueID = require("./src/UniqueId");

const idManager = new UniqueID();

console.log("index cfx");

//#endregion

wss.on("connection", function (ws) {
  var user = new User(ws, idManager);

  ws.on("message", function incoming(message) {
    user.packet.Erase(JSON.parse(JSON.stringify(message)).data);
    Handle(user.packet.ReadInt(), user, idManager);
  });

  ws.on("close", function incoming(message) {
    idManager.RemoveId(user.id);
    user.Disconnect();
  });
});

//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
