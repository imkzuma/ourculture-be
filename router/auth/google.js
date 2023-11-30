const express = require('express');
const { googleAuth, googleAuthCallback, googleLogin } = require("../../controller/auth/Google");

const router = express();

router.get('/', googleAuth);

router.get('/callback', googleAuthCallback, (req, res) => {
  res.status(200).json(req.user);
});

router.post('/login', googleLogin);

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy();
    res.redirect('/');
  });
});

module.exports = router;