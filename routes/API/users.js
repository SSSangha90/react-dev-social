const express = require('express')
const router = express.Router()
const { check, validationResult } = require("express-validator")
const gravitar = require('gravatar')
const bcrypt = require('bcryptjs')

const User = require('../Models/User')

// @route   POST api/users
// @desc    Register user route
// @access  Public
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email')
        .isEmail(),
    check('password', 'Please enter a password with at least 6 characters')
        .isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400)
                .json({ errors: errors.array()})
        }

        const { name, email, password } = req.body

        try {
        
        // See if user exists
        let  user = await User.findOne({ email })

        if(user) {
            res.status(400)
            .json({errors:[{ msg: 'User already exists' }]})
        }

        // Get user's gravitar
        const avatar = gravitar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        })

        // Encrypt the password
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        await user.save() // returns promise... used await

        // Return JSON Web Token
        res.send('User registered')

        } catch(err){
            console.error(err.message)
            res.status(500).send('Server error')
        }

    }
)

module.exports = router
