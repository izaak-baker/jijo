import { SourceConfig } from "../utils/rxdb.ts";
import { CorpusItem } from "../state/corpusState.ts";

export abstract class AbstractSource {
  constructor(protected config: SourceConfig) {}

  public getName(): string {
    return this.config.name;
  }

  public getId(): string {
    return this.config.id;
  }

  public getSourceType(): string {
    return this.config.sourceType;
  }

  public abstract loadCorpus(): Promise<CorpusItem[]>;

  protected async performGoogleOperation<T>(operation: () => T): Promise<T> {
    if (!window.gapiClientHasToken()) {
      const storedToken = window.getStoredGapiClientToken();
      if (!storedToken) {
        await window.googleLogin();
        return this.performGoogleOperation(operation);
      }
      window.setGapiClientToken(storedToken);
    }

    let response: T;
    try {
      response = await operation();
    } catch (e) {
      console.error(e);
      window.googleLogout();
      return this.performGoogleOperation(operation);
    }

    return response;
  }
}
