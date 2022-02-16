// src/lib/strings.ts
import eagerDash from "@lavadrop/kebab-case";
import eagerCamel from "@lavadrop/camel-case";

// node_modules/@pacote/memoize/lib/esm/index.js
function createCache() {
  const cache = {};
  return {
    has: (key) => Object.hasOwnProperty.call(cache, key),
    get: (key) => cache[key],
    set: (key, value) => {
      cache[key] = value;
    }
  };
}
function memoize(cacheKeyFn, fn) {
  const cache = createCache();
  return (...args) => {
    const key = cacheKeyFn(...args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
}

// src/lib/strings.ts
var identity = (x) => x;
var camel = memoize(identity, eagerCamel);
var dash = memoize(identity, eagerDash);
export {
  camel,
  dash
};
//# sourceMappingURL=strings.js.map
