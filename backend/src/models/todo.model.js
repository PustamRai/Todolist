import mongoose, {Schema} from "mongoose";

const textSchema = new Schema(
    {
        text: {
            type: String,
            required: true
        },
        completedTask: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true
    }
)

export const Task = mongoose.model("Task", textSchema)