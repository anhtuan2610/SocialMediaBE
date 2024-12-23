"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggedInUserInfo = void 0;
const users_1 = require("../models/users");
const getLoggedInUserInfo = async (req, res) => {
    try {
        const id = req.user.id;
        if (!id) {
            res.status(400).send("User ID Not Found!");
            return;
        }
        const userInfo = await users_1.UserModel.findById(id);
        if (!userInfo) {
            res.status(404).send("User Not Found!");
            return;
        }
        res
            .status(200)
            .json({ message: "Find User Information Success !", data: { userInfo } });
        return;
    }
    catch (error) {
        res.status(500).send("An error occurred while fetching user info.");
        return;
    }
};
exports.getLoggedInUserInfo = getLoggedInUserInfo;
//# sourceMappingURL=users.js.map