const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        author:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Author information is required"]
        },
        title: {
            type: String,
            required: [true, "Post title is required"]
        },
        body: {
            type: String,
            require: [true, "Post body is required"]
        }
    },
    { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true }
);

export default mongoose.model("Post", PostSchema);
