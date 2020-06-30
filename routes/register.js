const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const DbService = require("../services/DbService");
const { check, validationResult } = require("express-validator");
// const dotenv = require("dotenv");
// dotenv.config();

router.post(
    "/",
    [
        check("name", "Please provide a name").not().isEmpty(),
        check("email", "Please provide a valid email").isEmail(),
        check(
            "password",
            "Please provide at least 6 characters long password"
        ).isLength({ min: 6 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const { name, email, password } = req.body;
        try {
            let db = await DbService.getDbServiceInstance();
            const [user] = await db.getUserByEmail(email);
            if (user) {
                return res.status(400).json({ msg: "User already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            let insertedUser = {
                name: name,
                email: email,
                hashedPassword: hashedPassword,
            };
            insertedUser = await db.insertUser(insertedUser);
            const payload = {
                user: {
                    user_id: insertedUser.insertId,
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
