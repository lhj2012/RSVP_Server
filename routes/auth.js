const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DbService = require("../services/DbService");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
    const user_id = req.user.user_id;
    try {
        let db = await DbService.getDbServiceInstance();
        const [user] = await db.getUserById(user_id);
        res.json(user);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.post(
    "/",
    [
        check("email", "Please provide a valid email").isEmail(),
        check("password", "Please provide your password").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const { email, password } = req.body;
        try {
            let db = await DbService.getDbServiceInstance();
            const [user] = await db.getUserByEmail(email);
            if (!user) {
                return res.status(400).json({ msg: "Not a registered email" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(400).json({ msg: "Invalid credentials" });
            }
            const payload = {
                user: {
                    user_id: user.user_id,
                },
            };
            const accessToken = jwt.sign(
                payload,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: 3600 }
            );
            res.send({ accessToken });
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;
