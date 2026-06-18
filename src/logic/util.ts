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
    } else {
      setToken(storedToken);
    }
  }

  try {
    return await operation();
  } catch (e) {
    console.error(e);
    googleLogout();
    await googleLogin();
    return await operation();
  }
}
