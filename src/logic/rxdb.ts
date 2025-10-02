import { createRxDatabase, RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

export type SourceConfig = {
  id: string;
  name: string;
  sourceType: string;
  documentId: string;
  sheetNames: string[];
};

export async function setupDb(dbName: string): Promise<RxDatabase> {
  const clientRxdb = await createRxDatabase({
    name: dbName,
    storage: getRxStorageDexie(),
    ignoreDuplicate: true,
  });

  const sourceSchema = {
    version: 2,
    primaryKey: "id",
    type: "object",
    properties: {
      id: {
        type: "string",
        maxLength: 36,
      },
      name: {
        type: "string",
      },
      sourceType: {
        type: "string",
      },
      documentId: {
        type: "string",
      },
      sheetNames: {
        type: "array",
        items: {
          type: "string"
        }
      }
    },
    required: ["id", "name", "sourceType", "documentId"],
  };

  await clientRxdb.addCollections({
    sources: {
      schema: sourceSchema,
      migrationStrategies: {
        1: (v0) => {
          const v1 = structuredClone(v0);
          v1.documentId = v1.spreadsheetId;
          delete v1.spreadsheetId;
          v1.sourceType = "SheetsSource";
          return v1;
        },
        2: (v1) => {
          const v2 = structuredClone(v1);
          v2.sheetNames = [];
          return v2;
        }
      },
    },
  });

  return clientRxdb;
}
