"use strict";

// src/lib/fetch.ts
async function throwBadResponse(response) {
  const { ok, statusText } = response;
  if (!ok)
    throw new Error(statusText);
  return response;
}
export {
  throwBadResponse
};
//# sourceMappingURL=fetch.js.map
