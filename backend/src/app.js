import express from "express"
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes import
import taskRouter from "./routes/todo.route.js"

// routes declaration
app.use("/api/tasks", taskRouter)


export { app }