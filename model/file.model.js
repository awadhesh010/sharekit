import mongoose, { Schema, model } from 'mongoose'

const fileSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    
    filename: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },

    type: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },

    size: {
        type: Number,
        required: true
    },

    path: {
        type: String,
        trim: true,
        required: true
    }

}, {timestamps: true})

const FileModel = model("File", fileSchema)
export default FileModel