const mongoose = require("mongoose")
const password = "3rdMAY1998"
mongoose.connect(
    `mongodb+srv://Himanshu:${password}@cluster0.fpm5m.mongodb.net/timercards?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
mongoose.set("useCreateIndex", true)

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password_hash: String
})

exports.User = mongoose.model("user", userSchema)
