export async function performGoogleOperation<T>(
  operation: () => T,
): Promise<T> {
  if (!window.gapiClientHasToken()) {
    const storedToken = window.getStoredGapiClientToken();
    if (!storedToken) {
      await window.googleLogin();
      return performGoogleOperation(operation);
    }
    window.setGapiClientToken(storedToken);
  }

  let response: T;
  try {
    response = await operation();
  } catch (e) {
    console.error(e);
    window.googleLogout();
    return performGoogleOperation(operation);
  }

  return response;
}
