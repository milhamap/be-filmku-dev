const express = require('express')
const { createRole } = require('../src/resolvers/role')
const router = express.Router();

router.post('/', createRole)

module.exports = router