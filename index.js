const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

require('dotenv').config();

const roleRouter = require('./src/routes/roles')
const authRouter = require('./src/routes/users')

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/roles', roleRouter)
app.use('/auth', authRouter)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
})

module.exports = app;