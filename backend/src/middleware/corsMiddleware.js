import { ApiError } from "../utils/ApiError.js";


const allowedOrigins = [ "http://localhost:3000", "http://localhost:5173" ];

export const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;

    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin) {
        return next();
    }

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // Handle preflight requests
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return; 
        }
    } else {
        // Log the blocked origin to your terminal for debugging
        console.log(`BLOCKED CORS ORIGIN: '${origin}'`); 
        
        const error = new ApiError(403, "Forbidden", ["Origin not allowed"]);
        // In native node, we should end the response here to stop processing
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "CORS Forbidden" }));
        return;
    }

    next();
};