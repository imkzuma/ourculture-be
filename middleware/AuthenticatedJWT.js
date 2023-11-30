const jwt = require('jsonwebtoken');

function authenticatedJWT(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Unauthorized - Invalid token' });
    }

    req.user = user;  // Menyimpan informasi pengguna dalam objek req untuk penggunaan selanjutnya
    next();
  });
}

module.exports = authenticatedJWT;
