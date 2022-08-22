"use strict";

// src/lib/stripe.ts
function throwResponseError(response) {
  if (response.error)
    throw response.error;
  else
    return response;
}
export {
  throwResponseError
};
//# sourceMappingURL=stripe.js.map
