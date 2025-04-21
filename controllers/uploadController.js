import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn thư mục hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upload ảnh cho hộp quà
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const uploadBoxImage = async (req, res) => {
    try {
        console.log('Đang xử lý upload ảnh');
        console.log('Request files:', req.files);
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được tải lên'
            });
        }
        
        // Lấy file từ request
        const imageFile = req.files.image;
        console.log('File được tải lên:', imageFile.name);
        
        // Lấy phần mở rộng của file
        const fileExt = path.extname(imageFile.name).toLowerCase();
        
        // Tạo tên file chỉ sử dụng timestamp
        const timestamp = Date.now();
        const fileName = `${timestamp}${fileExt}`;
        
        // Đảm bảo thư mục tồn tại
        const imageDir = path.join(process.cwd(), '..', 'frontend', 'public', 'images', 'boxes');
        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
            console.log('Đã tạo thư mục:', imageDir);
        }
        
        // Đường dẫn thư mục lưu file
        const uploadPath = path.join(imageDir, fileName);
        console.log('Đường dẫn upload:', uploadPath);
        
        // Di chuyển file đến thư mục đích
        await imageFile.mv(uploadPath);
        console.log('Đã lưu file tại:', uploadPath);
        
        return res.status(200).json({
            success: true,
            message: 'Tải ảnh lên thành công',
            data: {
                fileName: fileName,
                filePath: `/images/boxes/${fileName}`
            }
        });
    } catch (error) {
        console.error('Lỗi khi tải ảnh lên:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tải ảnh lên',
            error: error.message
        });
    }
};

/**
 * Xóa ảnh hộp quà
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const deleteBoxImage = async (req, res) => {
    try {
        const fileName = req.params.fileName;
        
        // Xác thực tên file để tránh tấn công path traversal
        if (!fileName || fileName.includes('..') || fileName.includes('/')) {
            return res.status(400).json({
                success: false,
                message: 'Tên file không hợp lệ'
            });
        }
        
        const filePath = path.join(process.cwd(), '..', 'frontend', 'public', 'images', 'boxes', fileName);
        console.log('Đường dẫn file cần xóa:', filePath);
        
        // Kiểm tra xem file có tồn tại không
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy file'
            });
        }
        
        // Xóa file
        fs.unlinkSync(filePath);
        console.log('Đã xóa file:', filePath);
        
        return res.status(200).json({
            success: true,
            message: 'Xóa file thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa file:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa file',
            error: error.message
        });
    }
}; 