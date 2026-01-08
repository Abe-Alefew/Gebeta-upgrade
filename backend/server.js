import http from "http";
import { handleRequest } from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import "dotenv/config"; 

connectDB(); 
const PORT = process.env.PORT || 5000;
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
