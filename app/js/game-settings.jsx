export default {
  settings: {
    areSoundsOn: true
  },
  read() {
    return this.settings;
  },
  update(hash = {}) {
    this.settings = Object.assign(this.settings, hash);
  },
  toggleBoolean(key) {
    this.settings[key] = !this.settings[key];
  }
}
