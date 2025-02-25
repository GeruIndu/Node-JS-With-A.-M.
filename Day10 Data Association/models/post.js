const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    postTitle: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model('post', postSchema);