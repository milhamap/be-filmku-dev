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
        try {
            const { name, email, password, confirmPassword, phone } = req.body;
            const telepon = formatPhoneNumber(phone);
            const schema = {
                name: 'string|empty:false',
                email: 'email|empty:false',
                password: 'string|min:6|same:confirmPassword|empty:false',
                confirmPassword: 'string|min:6|same:password|empty:false',
                phone: 'string|min:11|max:13|empty:false'
            }
            const validate = v.validate(req.body, schema)
            if (validate.length) return res.status(400).json(validate);
            if (password !== confirmPassword) return res.status(400).json({message: 'Password or email not match'})
            let random
            do {
                random = uuid4()
            } while(await knex('dbo.users').where('random', random).then(data => data.length) !== 0)
            if(await knex('dbo.users').where({email: email}).orWhere({phone: telepon}).then(data => data.length) !== 0) return res.status(400).json({message: 'Email or Phone already exists'})
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)
            const user = await knex('dbo.users').insert({
                random: uuid4(),
                name: name,
                email: email,
                password: hashedPassword,
                phone: telepon,
                role_id: 3,
                createdAt: new Date(),
                updatedAt: new Date()
            }).returning('id')
            const data = await knex({ u: 'dbo.users' })
                         .join({r: 'dbo.roles'}, 'r.id', 'u.role_id')
                         .where('u.id', user[0].id)
                         .select({
                            id: 'u.id',
                            random: 'u.random',
                            name: 'u.name',
                            email: 'u.email',
                            phone: 'u.phone',
                            role_id: 'r.id',
                            role_name: 'r.name'
                         })
            res.status(200).json({
                message: 'Register Success',
                data: {
                    id: data[0].id,
                    random: data[0].random,
                    name: data[0].name,
                    email: data[0].email,
                    phone: data[0].phone,
                    role: {
                        id: data[0].role_id,
                        name: data[0].role_name
                    }
                }
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    login: async(req, res) => {
        try {
            const { email, password } = req.body;
            const schema = {
                email: 'email|empty:false',
                password: 'string|min:6|empty:false'
            }
            const validate = v.validate(req.body, schema);
            if(validate.length) return res.status(400).json(validate)
            const user = await knex({ u: 'dbo.users' }).where('email', email).first()
            if (!user) res.status(400).json({message: "Email or Password not match"})
            const validPassword = await bcrypt.compare(password, user.password)
            if(!validPassword) return res.status(400).json({message: 'Email or Password not match'})
            const token = createUserToken({
                id: user.id,
                email: user.email,
                role_id: user.role_id
            })
            const refreshToken = createRefreshToken({
                id: user.id,
                email: user.email,
                role_id: user.role_id
            })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            await knex('dbo.users').update({refreshToken: refreshToken}).where({email: email})
            res.status(200).json({
                message: 'Login Success',
                user,
                token
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }, 
    refreshToken: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(400).json({message: "Refresh token expired"})
            const user = await knex('dbo.users').where('refreshToken', refreshToken).first()
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.sendStatus(403)
                const token = createUserToken({
                    id: user.id,
                    email: user.email,
                    role_id: user.role_id
                })
                res.status(200).json({
                    message: 'Refresh token success',
                    token
                })
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    getUser: async (req, res) => {
        try {
            const data = await knex({ u: 'dbo.users' })
                         .join({r: 'dbo.roles'}, 'r.id', 'u.role_id')
                         .where('u.id', userId)
                         .select({
                            id: 'u.id',
                            random: 'u.random',
                            name: 'u.name',
                            email: 'u.email',
                            phone: 'u.phone',
                            role_id: 'r.id',
                            role_name: 'r.name'
                         })
            res.status(200).json({
                message: 'Register Success',
                data: {
                    id: data[0].id,
                    name: data[0].name,
                    email: data[0].email,
                    phone: data[0].phone,
                    role: {
                        id: data[0].role_id,
                        name: data[0].role_name
                    }
                }
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    },
    logout: async (req, res) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(204)
        const user = await knex('dbo.users').where('refreshToken', refreshToken).first()
        if (!user) return res.sendStatus(204)
        await knex('dbo.users').where({id: user.id}).update({refreshToken: null})
        res.clearCookie('refreshToken')
        res.status(200).json({message: "Logout Success"})
    }
}