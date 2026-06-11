const ACCESS_TOKEN_LS_KEY = "gapi_access_token";

const CLIENT_ID =
  window.location.host === "jijo.study"
    ? "1028113456064-ibumc17hdduobhp89cjhjldfll0v88gs.apps.googleusercontent.com"
    : "1028693753027-hsuov5dl8blv4g06bpgi3sg5330ort1k.apps.googleusercontent.com";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
  "https://www.googleapis.com/auth/documents.readonly",
].join(" ");

type GisTokenClient = {
  callback: (resp: { error?: string; access_token: string }) => void;
  requestAccessToken(options: { prompt: string }): void;
};

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient(config: {
            client_id: string;
            scope: string;
            callback: string;
          }): GisTokenClient;
          revoke(token: string): void;
        };
      };
    };
  }
}

let tokenClient: GisTokenClient | null = null;
let accessToken: string | null = null;

function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector('script[src*="accounts.google.com/gsi"]')) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load GIS script"));
    document.head.appendChild(script);
  });
}

async function ensureTokenClient(): Promise<GisTokenClient> {
  if (tokenClient) return tokenClient;
  await loadGisScript();
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: "",
  });
  return tokenClient;
}

export function hasToken(): boolean {
  return accessToken !== null;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_LS_KEY);
}

export function setToken(token: string): void {
  accessToken = token;
}

export function googleLogout(): void {
  if (accessToken) {
    window.google?.accounts?.oauth2?.revoke(accessToken);
    accessToken = null;
  }
  localStorage.removeItem(ACCESS_TOKEN_LS_KEY);
}

export async function googleLogin(): Promise<void> {
  const client = await ensureTokenClient();
  return new Promise((resolve, reject) => {
    client.callback = (resp) => {
      if (resp.error !== undefined) {
        reject(new Error(resp.error));
        return;
      }
      accessToken = resp.access_token;
      localStorage.setItem(ACCESS_TOKEN_LS_KEY, resp.access_token);
      resolve();
    };
    client.requestAccessToken({ prompt: "consent" });
  });
}

async function apiFetch<T>(url: string): Promise<T> {
  if (!accessToken) throw new Error("No access token");
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error(`Google API error: ${resp.status}`);
  return resp.json() as Promise<T>;
}

export type SpreadsheetResponse = {
  properties: { title: string };
  sheets: { properties: { title: string } }[];
  spreadsheetUrl: string;
};

export type SpreadsheetValuesResponse = {
  values: string[][];
};

export type DocResponse = {
  title: string;
  body: {
    content: {
      paragraph?: {
        elements: { textRun: { content: string } }[];
      };
    }[];
  };
};

export function getGoogleSpreadsheet(
  spreadsheetId: string,
): Promise<SpreadsheetResponse> {
  return apiFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
  );
}

export function getSpreadsheetValues(
  spreadsheetId: string,
  range: string,
): Promise<SpreadsheetValuesResponse> {
  return apiFetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
  );
}

export function getGoogleDoc(documentId: string): Promise<DocResponse> {
  return apiFetch(`https://docs.googleapis.com/v1/documents/${documentId}`);
}
