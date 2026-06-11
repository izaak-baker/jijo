import {
  hasToken,
  getStoredToken,
  setToken,
  googleLogin,
  googleLogout,
} from "./google.ts";

export async function performGoogleOperation<T>(
  operation: () => Promise<T>,
): Promise<T> {
  if (!hasToken()) {
    const storedToken = getStoredToken();
    if (!storedToken) {
      await googleLogin();
      return performGoogleOperation(operation);
    }
    setToken(storedToken);
  }

  try {
    return await operation();
  } catch (e) {
    console.error(e);
    googleLogout();
    return performGoogleOperation(operation);
  }
}
