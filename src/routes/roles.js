const express = require('express')
const { createRole, getsRole } = require('../resolvers/role')
const router = express.Router();

router.get('/', getsRole)
router.post('/', createRole)

module.exports = router