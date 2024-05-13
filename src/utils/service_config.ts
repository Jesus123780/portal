export const bacFetch = async (apiUrl: string, options) => {
  if (!apiUrl.includes('/v1')) {
    apiUrl = apiUrl.replace('/api/', '/api/v1/');
  }
  return fetch(apiUrl, options);
};
