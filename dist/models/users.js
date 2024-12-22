"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    fullName: { type: String, require: true },
    email: { type: String, require: true },
    authentication: {
        password: { type: String, require: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false },
    },
});
exports.UserModel = mongoose_1.default.model("User", UserSchema); // Mongoose sẽ chuyển "User" thành "users" // collection(table) trong db sẽ có tên là users // collection sẽ được tạo nếu như trong db chưa có (được tạo khi thao tác ghi dữ liệu vào collection lần đầu tiên như create , save , insert)
//# sourceMappingURL=users.js.map