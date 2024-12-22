"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const router_1 = __importDefault(require("./router")); // Nếu bạn import từ một thư mục mà không chỉ định tệp, Node.js sẽ mặc định tìm tệp index trong thư mục đó
const dotenv_1 = __importDefault(require("dotenv"));
// Load biến môi trường từ file .env
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL || "mongodb+srv://animals26102002:26102002@cluster0.kudat.mongodb.net/SocialMediaDb?retryWrites=true&w=majority&appName=Cluster0";
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
mongoose_1.default.Promise = Promise;
mongoose_1.default.connect(MONGO_URL)
    .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
})
    .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
});
mongoose_1.default.connection.on("error", (error) => console.log(error));
app.use("/", (0, router_1.default)());
exports.default = app;
//# sourceMappingURL=index.js.map