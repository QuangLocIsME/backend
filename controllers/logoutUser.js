
 const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        res.status(500).json({ message: 'Lỗi khi đăng xuất' });
    }
};

export default logoutUser;

