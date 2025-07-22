import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("data", "routes/data.ts"),
  route("todos", "routes/todos.tsx"),
] satisfies RouteConfig;
