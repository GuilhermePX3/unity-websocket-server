module.exports = class UniqueID {
  currentId = 1;
  ids = [0];

  GenerateId() {
    this.currentId = -1;

    this.ids.forEach((element, index) => {
      if (element !== index) {
        this.ids.splice(index, 0, index);
        this.currentId = index;
        return index;
      }
    });

    if (this.currentId === -1) {
      this.currentId = this.ids.length;
      this.ids.push(this.currentId);
    }

    this.ReorderIDs();
    return this.currentId;
  }

  RemoveId(id) {
    this.ReorderIDs();
    this.ids.splice(this.ids.indexOf(id), 1);
  }

  ReorderIDs() {
    this.ids = this.ids.sort((a, b) => {
      return a - b;
    });
  }
};
