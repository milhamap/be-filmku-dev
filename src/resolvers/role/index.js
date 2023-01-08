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
                name: name
            })
            res.status(200).json('Success created new role!');
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error.message
            })
        }
    }
}