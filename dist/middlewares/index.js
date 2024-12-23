"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header Authorization
    if (!token) {
        res.status(401).send("Access Token Missing!");
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Lưu thông tin giải mã vào req để sử dụng trong các handler
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(403).send("Invalid or Expired Access Token!");
    }
};
exports.authenticateToken = authenticateToken;
//# sourceMappingURL=index.js.map