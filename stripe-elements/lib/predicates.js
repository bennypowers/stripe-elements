// src/lib/predicates.ts
var elem = (xs) => (x) => xs.includes(x);
var not = (p) => (x) => !p(x);
var isRepresentation = elem(["paymentMethod", "source", "token"]);
export {
  elem,
  isRepresentation,
  not
};
//# sourceMappingURL=predicates.js.map
