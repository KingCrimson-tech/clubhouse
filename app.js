const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const path = require('path')
require('dotenv').config()

const app = express();

require('./config/passport')(passport)

//ejs setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//parsers
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//session data
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,  
    })
)

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//flash messages
app.use(flash())

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
}) 

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/messages', require('./routes/messages'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})