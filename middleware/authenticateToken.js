const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send({ message: 'Access Denied', success: false });

    console.log('Token:', token); // เพิ่มการ log token เพื่อดูว่าได้รับ token ถูกต้องหรือไม่
    jwt.verify(token, 'P@ssw0rd', (err, user) => {
    if (err) return res.status(403).send({ message: 'Invalid Token', success: false });
    req.user = user;
    next();
});

}


module.exports = authenticateToken;
