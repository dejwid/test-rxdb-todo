import {
  addRxPlugin,
  createRxDatabase,
  type RxDatabase,
} from "rxdb/plugins/core";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { getRxStorageLocalstorage } from "rxdb/plugins/storage-localstorage";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { replicateRxCollection } from "rxdb/plugins/replication";

addRxPlugin(RxDBDevModePlugin);

let dbPromise: null | Promise<RxDatabase> = null;

const createDb = async () => {
  const db = await createRxDatabase({
    name: "db",
    storage: wrappedValidateAjvStorage({
      storage: getRxStorageLocalstorage(),
    }),
  });

  await db.addCollections({
    // name of the collection
    todos: {
      // we use the JSON-schema standard
      schema: {
        version: 0,
        primaryKey: "_id",
        type: "object",
        properties: {
          _id: {
            type: "string",
            maxLength: 100, // <- the primary key must have maxLength
          },
          name: {
            type: "string",
          },
          done: {
            type: "boolean",
          },
          timestamp: {
            type: "string",
          },
        },
        required: ["name", "done", "timestamp"],
      },
    },
  });

  const replicationState = await replicateRxCollection({
    collection: db.collections.todos,
    replicationIdentifier: "my-http-replication",
    push: {
      handler: async (changedRows) => {
        console.log({ changedRows });
        return [];
      },
    },
    pull: {
      handler: async (checkpoint, batchSize) => {
        console.log("pull", checkpoint);
        return {
          documents: [
            {
              id: "1",
              name: "test pull",
              done: false,
              timestamp: new Date().toISOString(),
              _deleted: false,
            },
            {
              id: "2",
              name: "test pull 2",
              done: false,
              timestamp: new Date().toISOString(),
              _deleted: false,
            },
            {
              id: "3",
              name: "test pull 3",
              done: false,
              timestamp: new Date().toISOString(),
              _deleted: false,
            },
          ],
          checkpoint: { id: "asdfasdsdga" },
        };
      },
    },
  });
  await replicationState.awaitInSync();
  return db;
};

export const getDb = () => {
  if (!dbPromise) {
    dbPromise = createDb();
  }
  console.log("getdb");
  return dbPromise;
};
