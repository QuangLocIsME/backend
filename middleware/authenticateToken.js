import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "No token provided", error: true });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: "Token is not valid", error: true });
        req.user = user; 
        next();
    });
}
export default authenticateToken;