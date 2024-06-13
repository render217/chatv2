require("dotenv").config({ path: "./src/config/.env" });
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
exports.generateToken = (payload) => {
    return jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.verifyPassword = (candidatePassword, hashedPassword) => {
    return bcrypt.compareSync(candidatePassword, hashedPassword);
};
exports.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};
exports.verifyToken = (token) => {
    return jsonwebtoken.verify(token, process.env.JWT_SECRET);
};
