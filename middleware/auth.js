const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).json({ msg: "Access denied" });
    }
    try {
        const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid Token" });
    }
};

module.exports = auth;
