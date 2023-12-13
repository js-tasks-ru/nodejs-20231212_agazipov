function sum(a, b) {
  if (typeof a !== 'number') throw new TypeError();
  if (typeof b !== 'number') throw new TypeError();

  return a + b;
}

module.exports = sum;
