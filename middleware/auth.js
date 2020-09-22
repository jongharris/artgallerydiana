exports.loginAuth = (req, res, next) => {
    if (!req.session.login)
        return res.redirect('/login');
    next();
}

exports.adminAuth = (req, res, next) => {
    if(req.user.role != "admin") {
        return res.redirect('/');
    }
    next();
}