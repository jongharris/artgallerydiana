const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        loginError: req.flash('loginError')
    })
}

exports.postLogin = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        //create a new user object so we can access the functions
      
        //didn't find the user
        if (!user) {

            //this gets stored in the session
            req.flash('loginError', 'Invalid email or password.');
            return res.redirect('/login')
        }

        //validate the password
        bcrypt.compare(password, user.password).then(match => {

            if (match) {
                //password is valid
                req.session.user = user;
                req.session.login = true;
                req.user = new User(user.password, user.email, user.bag, user._id);

                return req.session.save(result=> {
                    res.redirect('/');
                })
            } else {
                res.redirect('/login');
            }
            
        }).catch(e => {
            console.log(e);
            res.redirect('/login');
        })
    })
    .catch (e => {
        console.log(e);
    })   
}

exports.getSignup = (req,res,next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        login: false
    })
}

exports.postSignup = (req, res, next) => {
   
    const email = req.body.email;
    const password = req.body.password;
    const confirm = req.body.confirm;

    //validate information, do this later


    //check confirmed password

    //create a new user
    User.findOne({email: email}).then(user => {
        //if the user exists than we will not create a new user
        if(user) 
            return res.redirect('/signup');

        //hash the password, salt of 12
       return bcrypt.hash(password, 12)
       .then(hashedPassword => {
        const newUser = new User(
            hashedPassword,
            email,
            "user"
        );

        return newUser.save()
       }).then(result => {
           res.redirect('login');
       })
    })
    .catch(e =>
        console.log(e))

}

exports.postLogout = (req,res,next) => {
    req.session.destroy();
    res.redirect('/');
}

exports.getReset = (req,res,next) => {
    res.render('auth/resetpass', {
        pageTitle: "Reset Password",
        login: false,
        loginError: req.flash('loginError')
    })
}