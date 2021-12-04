var jwt = require("jsonwebtoken")

/**
 * 
 * @description verify token sent by client if token is valid decode it and get user id and attach to request object
 */
exports.verifyAccessToken = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "No credentials sent!" })
    }
    const token = req.headers.authorization.split(" ")[1].trim()
    try {
        const payload = jwt.verify(token, config.jwtSecretKey)
        req.user = { uid: payload.id }
        next()
    } catch (e) {
        return res.status(400).json({ msg: "invalid token" })
    }
}
