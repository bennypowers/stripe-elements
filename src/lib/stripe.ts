export function throwResponseError<T extends { error?: unknown }>(response: T) {
  if (response.error) throw response.error;
  else return response;
}
