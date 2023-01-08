const knex = require('../../database');
const { v4: uuid4 } = require('uuid')
const Validator = require('fastest-validator')

const v = new Validator();

module.exports = {
    createRole: async (req, res) => {
        try {
            const name = req.body.name;
            const schema = {
                name: 'string|empty:false'
            }
            const validate = v.validate(req.body, schema)
            if(validate.length) return res.status(400).json(validate)
            const role = await knex('dbo.roles').insert({
                random: uuid4(),
                name: name,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            console.log(role)
            res.status(200).json({
                message: "Success created new role"
            });
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    },
    getsRole: async (req, res) => {
        try {
            const role = await knex('dbo.roles')
            res.status(200).json({
                data: role,
                message: "Success gets all role"
            })
        } catch (error) {
            res.status(500).json({
                message: "Internal Server Error",
                error: error.message
            })
        }
    }
}