import Router from "./lib/Router.js";
import { registerBusinessRoutes } from "./modules/business/business.routes.js";
const app = new Router();
registerBusinessRoutes(app);

const setHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

//test routes
app.get("/api/health", (req, res) => {
  setHeaders(res);
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "Gebeta API is online" }));
});

//send this function to the server inorder to define the routes and call the controller functions
export const handleRequest = (req, res) => {
  setHeaders(res);
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  app.handleRoutes(req, res);
};
