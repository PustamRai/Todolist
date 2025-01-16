import dotenv from "dotenv"
import { app } from "./app.js"
import connectDB from "./db/db.js"

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 8000

// when connection is build with "async" with database it returns promises automatically. So, .then and .catch is required to handle the error.
connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running at PORT: ${PORT}`);
    })
})
.catch((err) => {
    console.error("Mongodb connection failed!!", err)
})