const router = require("express").Router();
const DbService = require("../services/DbService");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

router.get("/", auth, async (req, res) => {
    try {
        let db = await DbService.getDbServiceInstance();
        const guests = await db.getGuests(req.user.user_id);
        res.json(guests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.post(
    "/",
    auth,
    [
        check("name", "Please provide your name").not().isEmpty(),
        check("phone", "Please provide your phone number").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const { name, phone, dietary } = req.body;
        try {
            let insertedGuest = {
                user_id: req.user.user_id,
                name,
                phone,
                dietary,
            };
            let db = await DbService.getDbServiceInstance();
            insertedGuest = await db.insertGuest(insertedGuest);
            res.json(insertedGuest);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.delete("/:id", auth, async (req, res) => {
    try {
        console.log("reached backend");
        let db = await DbService.getDbServiceInstance();
        const guest = await db.getGuest(req.params.id);
        if (!guest) {
            return res.status(404).json({ msg: "Guest not found" });
        }
        await db.deleteGuest(req.params.id);
        res.send("guest removed");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put(
    "/:id",
    auth,
    [
        check("name", "Please provide your name").not().isEmpty(),
        check("phone", "Please provide your phone number").not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        const { name, phone, dietary, isConfirmed } = req.body;
        try {
            let updatedGuest = {
                guest_id: req.params.id,
                name,
                phone,
                dietary,
                isConfirmed,
            };
            let db = await DbService.getDbServiceInstance();
            updatedGuest = await db.updateGuest(updatedGuest);
            res.json(updatedGuest);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
