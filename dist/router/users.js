"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = require("../controllers/users");
const index_1 = require("../middlewares/index");
exports.default = (router) => {
    router.get("/users/get-info", index_1.authenticateToken, users_1.getLoggedInUserInfo);
};
//# sourceMappingURL=users.js.map