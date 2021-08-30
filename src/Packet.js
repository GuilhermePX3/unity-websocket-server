module.exports = class Packet {
  buffer = { type: "Buffer", data: [] };
  pos = 0;

  constructor(bytes = undefined) {
    if (bytes !== undefined)
      bytes.forEach((element) => {
        this.buffer.push(element);
      });
  }

  Write(x) {
    var bytes = [x, x >> 8, x >> 16, x >> 24];

    try {
      this.buffer.data = this.buffer.data.concat(bytes);
    } catch (e) {
      console.log(e + "\n" + JSON.parse(this.buffer));
    }
  }

  AddBuffer(bytes) {
    this.buffer.data.concat(bytes);
  }

  ReadInt(keepPos = false) {
    var dataView = new DataView(
      new Uint8Array(this.buffer.data).buffer
    ).getUint32(this.pos, true);

    if (!keepPos) this.pos += 4;

    return dataView;
  }

  ReadString() {
    var result = "";
    for (var i = 0; i < this.buffer.length; i++) {
      result += String.fromCharCode(parseInt(this.buffer[i], 2));
    }
    return result;
  }

  Erase(bytes) {
    this.pos = 0;
    this.buffer = { type: "Buffer", data: [] };

    if (bytes !== undefined)
      bytes.forEach((element) => {
        this.buffer.data.push(element);
      });
  }
};
