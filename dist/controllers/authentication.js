"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const helpers_1 = require("../helpers");
const users_1 = require("../models/users");
const register = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        if (!email || !password || !fullName) {
            res.status(400).send("Missing required fields !");
            return;
        }
        const existingUser = await users_1.UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).send("This email already exists !");
            return;
        }
        const salt = (0, helpers_1.random)();
        const user = await users_1.UserModel.create({
            email,
            fullName,
            authentication: {
                salt,
                password: (0, helpers_1.authentication)(salt, password),
            },
        });
        res.status(200).json(user);
        return;
    }
    catch (error) {
        res.sendStatus(400);
        return;
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).send("Missing required fields !");
            return;
        }
        const user = await users_1.UserModel.findOne({ email }).select("+authentication.salt +authentication.password"); // mongo chỉ trả ra các trường có select: true định nghĩa trong schema (mà passwod với salt đang để là select: false(trong users model) nên là phải dùng select('') để lấy ra nó)
        if (!user) {
            res.status(400).send("Email not found !");
            return;
        }
        const passwordHash = (0, helpers_1.authentication)(user.authentication.salt, password);
        if (user.authentication.password !== passwordHash) {
            res.status(400).send("Password is not correct !");
            return;
        }
        res.status(200).send("Login successful !");
    }
    catch (error) {
        res.sendStatus(400);
        return;
    }
};
exports.login = login;
//# sourceMappingURL=authentication.js.map