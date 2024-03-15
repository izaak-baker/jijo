import { createRxDatabase, RxDatabase } from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

export type SheetsSourceConfig = {
  id: string;
  name: string;
  spreadsheetId: string;
};

export async function setupDb(dbName: string): Promise<RxDatabase> {
  const clientRxdb = await createRxDatabase({
    name: dbName,
    storage: getRxStorageDexie(),
    ignoreDuplicate: true,
  });

  const sheetsSourceSchema = {
    version: 0,
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
      spreadsheetId: {
        type: "string",
      },
    },
    required: ["id", "name", "spreadsheetId"],
  };

  await clientRxdb.addCollections({
    sources: {
      schema: sheetsSourceSchema,
    },
  });

  return clientRxdb;
}
