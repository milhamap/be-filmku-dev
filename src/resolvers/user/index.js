const knex = require('../../database')
const bcrypt = require('bcrypt')
const { formatPhoneNumber } = require('../../helpers/phone')
const { createUserToken, createRefreshToken } = require('../../helpers/tokens')
const Validator = require('fastest-validator')
const jwt = require('jsonwebtoken')
const { v4: uuid4 } = require('uuid')

const v = new Validator();

module.exports = {
    register: async (req, res) => {
        
    }
}