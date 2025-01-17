import mongoose, {Schema} from "mongoose";

const textSchema = new Schema(
    {
        text: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const Task = mongoose.model("Task", textSchema)