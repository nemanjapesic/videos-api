import mongoose from "mongoose";

const Video = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: String,
            required: true,
        },
    ],
    thumbnail: {
        type: String,
        required: true,
    },
    date_added: {
        type: Date,
        default: Date.now,
    },
    disabled: {
        type: Boolean,
        required: true,
    },
});

export default mongoose.model("Video", Video);
