const UniqueID = require("./UniqueId");

module.exports = class Room {
  users = [];
  objects = [];
  manager = new UniqueID();
  maxPlayers = 6;

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
