import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    fullname : {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },

    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    picture: {
        type: String,
        trim: true
    }
}, {timestamps: true})


userSchema.pre('save', async function(next) {
    const count = await model("User").countDocuments({email: this.email})
    
    if(count)
        throw next(new Error("User already exist !"))

    next()
})


userSchema.pre('save', async function(next) {
    const encrypted = await bcrypt.hash(this.password.toString(), 12)
    this.password = encrypted
    next()
})

const UserModel = model("User", userSchema)
export default UserModel