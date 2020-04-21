/**
 * Throws an error if the response is not OK.)
 */
export async function throwBadResponse(response: Response): Promise<Response> {
  const { ok, statusText } = response;
  if (!ok) throw new Error(statusText);
  return response;
}
