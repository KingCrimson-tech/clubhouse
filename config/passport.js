const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool = require('./db');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, async (email, password, done) => {
            try {
                const { rows } = await pool.query('select * from users where email = $1', [email])
                const user = rows[0]

                if (!user){
                    return done(null, false, { message: 'No user with that email'})
                }

                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch){
                    return done(null, false, {message: 'Password incorrect'})
                }

                return done(null, user)
            } catch (err) {
                return done(err)
            }
        })
    )


    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const { rows } = await pool.query('select * from users where id = $1', [id])
            done(null, rows[0])
        } catch(err){
            done(err)
        }
    })
}