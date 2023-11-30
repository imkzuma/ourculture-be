const express = require('express');
const { localLogin, localRegister } = require('../../controller/auth/Local');

const router = express();

router.post("/login", localLogin);
router.post("/register", localRegister);

module.exports = router;