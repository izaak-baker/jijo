import { SourceConfig } from "../logic/rxdb.ts";
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

  public getUrl(): string {
    return this.config.url;
  }

  public getRemoteName(): string {
    return this.config.remoteName;
  }

  public abstract loadCorpus(): Promise<CorpusItem[]>;
}
