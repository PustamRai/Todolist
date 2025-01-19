import express from "express"
import cors from "cors"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// routes import
import taskRouter from "./routes/todo.route.js"

// routes declaration
app.use("/api/todo", taskRouter)


export { app }