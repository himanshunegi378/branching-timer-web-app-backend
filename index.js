var jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const express = require("express")
const cors = require("cors")
const { User } = require("./database")
const { config } = require("./config")
const app = express()

app.use(
    cors({
        origin: [
            "http://localhost:3000"
        ]
    })
)
app.use(express.json())

app.post("/api/signup", async (req, res) => {
    const { username, password1, password2 } = req.body
    const user = await User.findOne({ username: username }).exec()
    if (user) {
        return res.status(409).json({ msg: "useranme already exists" })
    }
    const passwordHash = await bcrypt.hash(password1, 10)
    const newUser = await new User({
        username: username,
        password_hash: passwordHash
    }).save()
    const accessToken = jwt.sign({ id: newUser._id }, config.jwtSecretKey, {
        expiresIn: "1h"
    })
    const refreshToken = jwt.sign({ id: newUser._id }, config.jwtSecretKey, {
        expiresIn: "30d"
    })
    res.json({ accessToken, refreshToken })
})

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username: username }).exec()
    if (!user) {
        return res.status(404).json({ msg: "user does not exist" })
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash)
    if (!isPasswordCorrect) {
        return res.status(403).json({ msg: "Wrong password" })
    }
    const accessToken = jwt.sign({ id: user._id }, config.jwtSecretKey, {
        expiresIn: "1h"
    })
    const refreshToken = jwt.sign({ id: user._id }, config.jwtSecretKey, {
        expiresIn: "30d"
    })
    res.json({ accessToken, refreshToken })
})

app.post("/api/refresh", (req, res) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: "No credentials sent!" })
    }
    const token = req.headers.authorization.split(" ")[1].trim()
    try {
        const payload = jwt.verify(token, config.jwtSecretKey)
        const accessToken = jwt.sign({ id: payload.id }, config.jwtSecretKey, {
            expiresIn: "1h"
        })
        return res.json({ accessToken })
    } catch (e) {
        return res.status(400).json({ msg: "invalid token" })
    }
})

app.listen(process.env.PORT || 5000, () => {
    console.log("server running on port 5000")
})
