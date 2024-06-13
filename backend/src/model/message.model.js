const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema(
    {
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            requried: true,
        },
        content: {
            type: String,
            trim: true,
        },
        chat: {
            // can be group-chatId  or
            //        1-2-1 chatId
            type: Schema.Types.ObjectId,
            ref: "Chat",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", messageSchema);
