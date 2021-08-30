const UniqueID = require("./UniqueId");

module.exports = class Room {
  constructor() {
    this.users = [];
    this.objects = [];
    this.manager = new UniqueID();
    this.maxPlayers = 6;
  }

  AddObject(object) {
    this.objects.push(object);
  }

  IsFull() {
    return this.users.length === this.maxPlayers;
  }

  DeleteObject(id) {
    this.objects.forEach((element, index) => {
      if (element.id === id) {
        this.manager.RemoveId(id);
        this.objects.splice(index, 1);
        return;
      }
    });
  }
};
