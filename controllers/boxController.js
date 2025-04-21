import Box from '../models/BoxModel.js';

/**
 * Lấy tất cả các hộp quà
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getAllBoxes = async (req, res) => {
    try {
        const boxes = await Box.find().sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách hộp quà thành công',
            data: boxes
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hộp quà:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách hộp quà',
            error: error.message
        });
    }
};

/**
 * Lấy thông tin một hộp quà theo ID
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const getBoxById = async (req, res) => {
    try {
        const boxId = req.params.id;
        const box = await Box.findOne({ boxId: boxId });
        
        if (!box) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hộp quà'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Lấy thông tin hộp quà thành công',
            data: box
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin hộp quà:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy thông tin hộp quà',
            error: error.message
        });
    }
};

/**
 * Tạo hộp quà mới
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const createBox = async (req, res) => {
    try {
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        const boxData = req.body;
        const boxType = req.body.boxType || 'STD'; // Lấy loại hộp từ request
       
        
        const GenerateBoxId = async () => {
            const prefix = 'BOX-' + boxType;
            
            const lastBox = await Box.findOne(
                { boxId: new RegExp('^' + prefix) },
                { boxId: 1 },
                { sort: { boxId: -1 } }
            );
            
            let counter = 0;
            
            if (lastBox && lastBox.boxId) {
                const lastCounter = parseInt(lastBox.boxId.substring(lastBox.boxId.lastIndexOf('-') + 1), 10);
                counter = lastCounter + 1;
            }
            
            const paddedCounter = String(counter).padStart(5, '0');
            
            // Tạo boxId mới
            return `${prefix}-${paddedCounter}`;
        };
        
        // Nếu không có sẵn boxId, tạo mới
        if (!boxData.boxId) {
            boxData.boxId = await GenerateBoxId();
        }
        
        const newBox = new Box(boxData);
        await newBox.save();
        
        return res.status(201).json({
            success: true,
            message: 'Tạo hộp quà mới thành công',
            data: newBox
        });
    } catch (error) {
        console.error('Lỗi khi tạo hộp quà mới:', error);
        
        // Xử lý lỗi validation
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Lỗi khi xác thực dữ liệu',
                error: validationErrors
            });
        }
        
        // Xử lý lỗi trùng lặp
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Tên hộp quà đã tồn tại',
                error: 'Duplicate key error'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo hộp quà mới',
            error: error.message
        });
    }
};

/**
 * Cập nhật thông tin hộp quà
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const updateBox = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
       
        const boxId = req.params.id;
        const updateData = req.body;
        
        // Không cho phép thay đổi boxId và boxType sau khi đã tạo
        delete updateData.boxId;
        delete updateData.boxType;
        
        // Cập nhật thời gian chỉnh sửa
        updateData.updatedAt = Date.now();
        
        const updatedBox = await Box.findOneAndUpdate(
            { boxId: boxId },
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedBox) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hộp quà'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Cập nhật hộp quà thành công',
            data: updatedBox
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật hộp quà:', error);
        
        // Xử lý lỗi validation
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Lỗi khi xác thực dữ liệu',
                error: validationErrors
            });
        }
        
        // Xử lý lỗi trùng lặp
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Tên hộp quà đã tồn tại',
                error: 'Duplicate key error'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật hộp quà',
            error: error.message
        });
    }
};

/**
 * Xóa hộp quà
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const deleteBox = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        const boxId = req.params.id;
        const deletedBox = await Box.findOneAndDelete({ boxId: boxId });
        
        if (!deletedBox) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hộp quà'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Xóa hộp quà thành công',
            data: deletedBox
        });
    } catch (error) {
        console.error('Lỗi khi xóa hộp quà:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xóa hộp quà',
            error: error.message
        });
    }
};

/**
 * Chuyển đổi trạng thái hoạt động của hộp quà
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const toggleBoxStatus = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (req.user.role == 'user') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền thực hiện hành động này'
            });
        }
        
        const boxId = req.params.id;
        const box = await Box.findOne({ boxId: boxId });
        
        if (!box) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hộp quà'
            });
        }
        
        // Chuyển đổi trạng thái
        box.isActive = !box.isActive;
        await box.save();
        
        return res.status(200).json({
            success: true,
            message: `Đã ${box.isActive ? 'kích hoạt' : 'vô hiệu hóa'} hộp quà thành công`,
            data: box
        });
    } catch (error) {
        console.error('Lỗi khi chuyển đổi trạng thái hộp quà:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi chuyển đổi trạng thái hộp quà',
            error: error.message
        });
    }
}; 