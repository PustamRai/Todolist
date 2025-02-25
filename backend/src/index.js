import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/db.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 8001;

// when connection is build with "async" with database it returns promises automatically. So, .then and .catch is required to handle the error.
connectDB()
.then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection failed!!", err);
});

export default app