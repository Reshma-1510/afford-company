export const fetchWithLogging = async (url, options) => {
  console.log(`[API Request] ${options?.method || 'GET'} ${url}`);
  try {
    const response = await fetch(url, options);
    console.log(`[API Response] ${response.status} ${url}`);
    return response;
  } catch (error) {
    console.error(`[API Error]`, error);
    throw error;
  }
};