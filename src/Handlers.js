const Packet = require("./Packet");
const Room = require("./Room");
const ServerObject = require("./Object");

var rooms = [];

const handlers = [
  undefined, //on open
  undefined, //register client
  JoinRoom,
  LeftRoom,
  undefined, //invite
  AddObject,
  undefined, //remote object add
  RemoveObject,
  Transform,
  TransformVelocity,
  ObjectProps,
  undefined, //Toggle Visible
  LoadObjects,
];

function JoinRoom(user) {
  user.room = -1;
  rooms.forEach((element, index) => {
    if (element !== undefined && element.users.length < element.maxPlayers) {
      user.room = index;
      return;
    }
  });

  if (rooms.length > 0) {
    rooms.forEach(({ element, index }) => {
      if (rooms[index] !== undefined && !rooms[index].IsFull()) {
        user.room = index;
        return;
      }
    });
  } else {
    user.room = 0;
    rooms[0] = new Room();
  }

  if (user.room === -1) user.room = rooms.length;

  if (rooms[user.room] === undefined || rooms.length <= 0)
    rooms[user.room] = new Room();

  rooms[user.room].users.push(user);

  user.packet.Write(user.room);

  user.Retrieve();
  LoadObjects(user);

  console.log("joined room\n" + JSON.stringify(rooms[user.room].users.length));
}

function LeftRoom(user) {
  user.LeftRoom();
}

function Invite(user) {
  user.Retrieve();
  user.BroadcastAll(rooms, user.packet.buffer);
}

function AddObject(user) {
  var id = rooms[user.room].manager.GenerateId();

  user.myObjects.push(id);
  user.packet.Write(id);
  console.log("Add Local " + JSON.stringify(user.packet.buffer));
  user.Retrieve();

  user.packet.buffer.data[0] = 6;

  console.log("Add Remote " + JSON.stringify(user.packet.buffer));
  user.Broadcast();

  rooms[user.room].objects.push(new ServerObject(id, user.packet.buffer.data));
}

function RemoveObject(user) {
  var id = user.packet.ReadInt();
  rooms[user.room].DeleteObject(id);
  user.RemoveObject(id);
  user.Retrieve();
  user.Broadcast();
}

function Transform(user) {
  user.Broadcast();
}

function TransformVelocity(user) {
  user.Broadcast();
}

function ObjectProps(user) {
  rooms[user.room].objects[user.packet.ReadInt()].props =
    user.packet.buffer.data;

  user.Broadcast();
}

function RemoveObject(user) {
  user.Broadcast();
  user.RemoveObject(user.packet.ReadInt());
}

function LoadObjects(user) {
  if (rooms[user.room].objects.length > 0)
    rooms[user.room].objects.forEach((element) => {
      user.packet.Erase(element.data);
      user.Retrieve();
      user.packet.Erase(element.props);
      user.Retrieve();
    });
}

function Handle(id, user, idManager) {
  if (handlers[id] !== undefined && id < 1000) {
    handlers[id](user);
  } else {
    switch (id) {
      case 1000:
        user.Disconnect();
        idManager.RemoveId(user.id);
        break;
    }
  }
}

module.exports = { Handle, rooms };
