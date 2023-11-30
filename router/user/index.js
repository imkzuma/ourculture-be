const express = require('express');
const authenticatedJWT = require('../../middleware/AuthenticatedJWT');
const { getWhoAmI, getProfileByUsername } = require('../../controller/user');

const router = express();

router.get("/whoami", authenticatedJWT, getWhoAmI);
router.get("/:username", authenticatedJWT, getProfileByUsername);

module.exports = router;