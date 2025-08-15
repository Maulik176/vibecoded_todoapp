import express from "express"
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5001; // Use PORT from .env or default to 5001
const __dirname = path.resolve(); // Get the current directory name

if(process.env.NODE_ENV !== "production") {
    app.use(cors());
}

app.use(express.json()); // Middleware to parse JSON request bodies.
app.use(rateLimiter);



//simple custom middleware
// app.use((req,res,next) => {
//     console.log("Request received:", req.method, req.url);
//     next(); // Proceed to the next middleware or route handler
// });
app.use("/api/notes", notesRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Serve static files from the frontend build directory
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend" ,"dist", "index.html")); // Serve index.html for all other routes
});
}


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server has started on PORT:", PORT);
    })
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

//our application should start when connection to DB is successful, otherwise it should log an error message


// mongodb+srv://maulikranadive355:RqqIExp6XyCFBCra@cluster0.lqoxezr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

//what does endpoint mean?
//endpoint is a combination of URL + HTTP method that lets the client interact with
//the server or a specific resource. 
//For example, GET /api/notes is an endpoint that allows the client to retrieve notes.
