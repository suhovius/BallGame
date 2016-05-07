export default {
  internalData() {
    if (!this.internalDataIsSet) {
      this.canvas = document.querySelector("#myCanvas");
      this.context2d = this.canvas.getContext('2d');
      this.internalDataIsSet = true;
    }
    return this;
  },
  getCanvas() {
    return this.internalData().canvas;
  },
  getContext2D() {
    return this.internalData().context2d;
  }
}
