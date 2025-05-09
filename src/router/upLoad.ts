import { upLoadImage } from "../controllers/upLoad";
import express from "express";
import { authenticateToken } from "../middlewares";
import multer from "multer";

const upload = multer({ dest: "uploads/" }); // multer chỉ đảm nhận vai trò xử lý file,
// còn tất cả loại dữ liệu text trong formdata, Express có thể tự xử lý ngay cả khi không có multer

export default (router: express.Router): void => {
  router.post(
    "/upload/uploadImage",
    authenticateToken,
    upload.single("image"), //  nghĩa là multer sẽ tìm trong req một trường có tên "image" trong multipart/form-data request. // Nếu request gửi theo dạng multipart/form-data,
    // ngoài file upload, các trường khác vẫn sẽ được Express xử lý bình thường và giữ trong req.body
    upLoadImage
  ); // trung gian lưu ảnh vào thư mục tạm thời uploads (có thể chọn các cách lưu tạm thời khác nhau)
};
