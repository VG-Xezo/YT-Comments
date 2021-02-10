import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    email: String,
    username: String,
    pfp: String,
    password: String
})

export default mongoose.model("users", userSchema)