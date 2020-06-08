const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: String,
    username: String,
    imdbId: String,
    comment: String,
    time : { type : Date, default: Date.now }
});

// commentSchema.methods.generateToken = function() {
//     return jwt.sign(
//         {
//             userid: this._id,
//             username: this.username
//         },
//         jwtSecret.jwtSecret,
//         {
//             expiresIn: 36000
//         }
//     );
// };

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;