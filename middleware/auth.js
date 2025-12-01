//Middlewares


// user check 
function ensureAuthenticated(req, res, next){
    if ( req.isAuthenticated() ) {
        return next()
    }
    req.flash('error_msg', 'Please log in to view that resource')
    res.redirect('/login')
}

//member check
function ensureMember(req, res, next){
    if(req.isAuthenticated() && req.user.is_member) {
        return next()
    }
    req.flash('error_msg', 'You must be a member to view that resource')
    res.redirect('/join-club')
}

//admin check
function ensureAdmin(req, res, next){
    if (req.isAuthenticated() && req.user.is_admin){
        return next()
    }
    req.flash('error_msg', 'You must be an admin to view that resource')
    res.redirect('/')
}

//redirec if logged in
function forwardAuthenticated(req, res, next){
    if (!req.isAuthenticated()){
        return next()
    }
    res.redirect('/')
}

module.exports = {
    ensureAuthenticated,
    ensureMember,
    ensureAdmin,
    forwardAuthenticated
}