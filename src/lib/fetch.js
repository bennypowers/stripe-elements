/**
 * Throws an error if the response is not OK.)
 * @param  {Response} response
 * @resolves {Response}
 * @rejects {Error}
 */
export async function throwBadResponse(response) {
  const { ok, statusText } = response;
  if (!ok) throw new Error(statusText);
  return response;
}
