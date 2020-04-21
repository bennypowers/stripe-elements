export function throwResponseError(response) {
  if (response.error) throw response.error;
  else return response;
}
