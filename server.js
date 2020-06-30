const express = require("express");
const dotenv = require("dotenv");
const registerRouter = require("./routes/register");
const authRouter = require("./routes/auth");
const guestRouter = require("./routes/guests");
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/register", registerRouter);
app.use("/api/auth", authRouter);
app.use("/api/guests", guestRouter);

const SERVER_PORT = process.env.SERVER_PORT || 5000;

app.listen(SERVER_PORT, () => {
    console.log(`Server started at port ${SERVER_PORT}`);
});
