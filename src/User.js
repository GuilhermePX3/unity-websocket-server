const Packet = require("../src/Packet");
const { rooms } = require("./Handlers");

module.exports = class User {
  //0

  constructor(socket, id) {
    this.id = id.GenerateId();
    this.room = -1;
    this.myObjects = [];
    this.socket = undefined;
    this.packet = new Packet();

    console.log("USER > " + id.length + " " + this.id);

    this.packet.Write(1);
    this.packet.Write(this.id);

    this.socket = socket;
    this.Retrieve();
  }

  Retrieve() {
    if (this.packet.buffer.data.length > 0)
      this.socket.send(this.packet.buffer);
  }

  Broadcast(id) {
    rooms[this.room].users.forEach((us) => {
      if (us.id !== this.id && id === undefined) {
        us.socket.send(this.packet.buffer);
      } else if (id !== undefined) {
        if (us.id === id) {
          us.socket.send(this.packet.buffer);
        }
      }
    });
  }

  BroadcastAll(rooms, data) {
    rooms.forEach((element) => {
      rooms[element].users.forEach((element) => {
        element.socket.send(data);
      });
    });
  }

  AddObject(object) {
    this.myObjects.push(object);
  }

  RemoveObject(id) {
    this.myObjects.splice(this.myObjects.indexOf(id), 1);
  }

  LeftRoom() {
    if (rooms[this.room] === undefined) {
      console.log("Room Null");
      return;
    }

    var userIndex = -1;

    this.myObjects.forEach((id) => {
      rooms[this.room].DeleteObject(id);
      this.packet.Erase();
      this.packet.Write(7);
      this.packet.Write(id);

      this.Broadcast();
    });

    rooms[this.room].users.forEach((element, index) => {
      if (element.id === this.id) {
        userIndex = index;
      }
    });

    rooms[this.room].users.splice(userIndex, 1);

    this.room = -1;
  }

  Disconnect() {
    this.LeftRoom();
    this.socket.close();
  }
};
