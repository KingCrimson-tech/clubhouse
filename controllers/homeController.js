const Message = require('../models/Message')
const User = require('../models/User')

//get route(GET / )
exports.getHome = async (req, res) => {
    try {
        const messages = await Message.getAll()
        res.render2('index', {
            messages,
            title: 'Clubhouse - Home'
        })
    } catch (err){
        console.error(err)
        res.flash('error', 'An error occurred while loading messages.')
        res.render('index', {messages: []})
    }
}

//join club route (GET /join-club)
exports.getJoinClub = (req, res) => {
    if(req.user.is_member){
        req.flash('error_msg', 'You are already a member')
        return res.redirect('/')
    }
    res.render('join-club', { title: 'Join the club'})
}

//(POST /join-club)
exports.postJoinClub = async (req, res) => {
    const { secret } = req.body

    if (req.user.is_member) {
        req.flash('error_msg', 'You are already a member')
        return res.redirect('/')
    }

    if (secret === process.env.MEMBER_SECRET) {
        try {
            await User.makeMember(req.user.id)
            req.flash('success_msg', 'You have successfully joined the club!')
            res.redirect('/')
        } catch (err){
            console.error(err)
            req.flash('error_msg', 'An error occurred while processing your request.')
            res.redirect('/join-club')
        }
    } else {
        req.flash('error_msg', 'Invalid secret code')
        res.redirect('/join-club')
    }
}

// GET /become-admin
exports.getBecomeAdmin = (req, res) => {
    if(req.user.is_admin){
        req.flash('error_msg', 'You are already an admin')
        return res.redirect('/')
    }
    res.render('become-admin', { title: 'Become an admin'})
}

// POST /become-admin
exports.postBecomeAdmin = async (req, res) => {
    const { admin_secret } = req.body

    if (req.user.is_admin) {
        req.flash('error_msg', 'You are already an admin')
        return res.redirect('/')
    }

    if (admin_secret === process.env.ADMIN_SECRET) {
        try {
            await User.makeAdmin(req.user.id)
            req.flash('success_msg', 'You have successfully become an admin!')
            res.redirect('/')
        } catch (err){
            console.error(err)
            req.flash('error_msg', 'An error occurred while processing your request.')
            res.redirect('/become-admin')
        }
    } else {
        req.flash('error_msg', 'Invalid admin secret code')
        res.redirect('/become-admin')
    }
}