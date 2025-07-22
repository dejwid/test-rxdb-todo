import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { MongoClient } from "mongodb";
import md5 from "md5";

async function getDbClient() {
  const client = new MongoClient(process.env.DB as string);
  await client.connect();
  return client.db("test");
}

export async function loader(_: LoaderFunctionArgs) {
  const dbClient = await getDbClient();
  const todos = await dbClient
    .collection("todos")
    .find({}, { sort: { _id: 1 } });
  const myTodos = await todos.toArray();
  const checksum = md5(JSON.stringify(myTodos));
  return Response.json({
    documents: myTodos,
    checkpoint: { id: checksum },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();
  
  return Response.json({
    message: "I handle everything else",
    body,
  });
}
