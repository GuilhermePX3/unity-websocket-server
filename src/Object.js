module.exports = class ServerObject {
  id = -1;
  data = [];
  props = [];

  constructor(id, data) {
    this.id = id;
    this.data = data;
  }
};
