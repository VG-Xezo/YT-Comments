import mongoose from "mongoose"

const videoSchema = mongoose.Schema({
    author: String,
    title: String,
    desc: String,
    id: String,
    views: String,
    likes: String,
    comments: [],
    likers: []
})

export default mongoose.model("videos", videoSchema)