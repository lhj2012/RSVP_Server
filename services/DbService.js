const dotenv = require("dotenv");
let db = require("mysql-promise")();
let instance = null;
dotenv.config();

try {
    db.configure({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        port: process.env.DB_PORT,
    });
    console.log("db connection: " + db.isConfigured());
} catch (err) {
    console.error(err.message);
}

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getUserByEmail(email) {
        try {
            const queryString = "SELECT * FROM users WHERE users.email = ?";
            const [result] = await db.query(queryString, [email]);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    async getUserById(user_id) {
        try {
            const queryString = "SELECT * FROM users WHERE users.user_id = ?";
            const [result] = await db.query(queryString, [user_id]);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    async insertUser(user) {
        try {
            const queryString =
                "INSERT INTO users (name, email, password, created_date) VALUES (?, ?, ?, NOW());";
            const [result] = await db.query(queryString, [
                user.name,
                user.email,
                user.hashedPassword,
            ]);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    async getGuests(user_id) {
        try {
            const queryString = "SELECT * FROM guests WHERE guests.user_id = ?";
            const [result] = await db.query(queryString, [user_id]);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    async insertGuest(guest) {
        try {
            const queryString =
                "INSERT INTO guests (user_id, name, phone, dietary, created_date) VALUES (?, ?, ?, ?, NOW())";
            const [result] = await db.query(queryString, [
                guest.user_id,
                guest.name,
                guest.phone,
                guest.dietary,
                // guest.isConfirmed,
            ]);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    async getGuest(guest_id) {
        try {
            const queryString =
                "SELECT * FROM guests WHERE guests.guest_id = ?";
            const [result] = await db.query(queryString, [guest_id]);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }

    async deleteGuest(guest_id) {
        try {
            const queryString = "DELETE FROM guests WHERE guest_id = ?";
            await db.query(queryString, [guest_id]);
        } catch (err) {
            console.error(err.message);
        }
    }

    async updateGuest(guest) {
        try {
            const queryString =
                "UPDATE guests SET name=?, phone=?, dietary=?, is_confirmed=? WHERE guest_id=?";
            const [result] = await db.query(queryString, [
                guest.name,
                guest.phone,
                guest.dietary,
                guest.isConfirmed,
                guest.guest_id,
            ]);
            return result;
        } catch (err) {
            console.error(err.message);
        }
    }
}

module.exports = DbService;
