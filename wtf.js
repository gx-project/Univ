/*const cookies = {
  get: {},
  signeds: {},
  set set([key, value, options]) {
    this.get[key] = value;
  },
  get signed() {
    return this.signeds;
  },
  set signed([key, value, options]) {
    this.signeds[key] = value;
  }
};

cookies.set = ["normal", 0];
cookies.set = ["normal1", 1];
cookies.signed = ["signed", 2];
cookies.signed = ["signed2", 3];

console.log("normal", cookies.get);
console.log("signed", cookies.signed);
*/
const cp = new Proxy(
  {},
  {
    get(target, prop) {
      return target[prop];
    },
    set(target, prop, value) {
      return (target[prop] = value);
    }
  }
);

cp.asd = "asd";

console.log(cp);
