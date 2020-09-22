const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const multer = require('multer');
const mongodb = require('mongodb');
const session = require('express-session');
const mongodbStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb+srv://jon:qur7hnt7ySG6Skrn@cluster0.z1rdx.mongodb.net/Gallery?retryWrites=true&w=majority';
const store = new mongodbStore({
    //connection string, which DB server
    uri: MONGODB_URI,
    collection: 'sessions'
})

//value for storage
const fileStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, 'images');
    },
    //ensure the filename is unique and doesn't get overwritten
    filename: (req,file,cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

//filter the mime types allowed (jpeg, png)

const fileFilter = (req,file,cb) => {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
        cb(null, true);
    else
        cb(null,false);
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/authUser');
const errorController = require('./controllers/404');

//we need to parse the body. BODY PARSER
app.use(bodyParser.urlencoded({extended: false}));

//we need to parse for a single file named image
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));

//middleware for CSRF attacks
const protectCSRF = csrf();

//serve files statically (not handled by router or middleware). Directly forwarded to file system
//pass a path (to main.css)
app.use(express.static(path.join(__dirname, 'public')));

//serve the image folder statically
app.use('/images', express.static(path.join(__dirname, 'images')));

//register the session, secret for signing the hash, resave session not saved on every response sent, only on changes
app.use(
    session({secret:'thisismysecretandisalongerstring', resave: false, saveUnitialized: false, store:store})
);

//middleware for CSRF attacks
app.use(protectCSRF);

//middleware for flashing error messages
app.use(flash());

app.use((req,res,next) => {

    if(!req.session.user) {
        return next();
    }
    
    User.findOne({email: req.session.user.email})
    .then(user => {
        req.user = new User(user.password, user.email, user.role, user.bag, user._id);
        next();
    })
    .catch(e => {
        console.log(e);
    })
  
})

//set the csrf token to all views and login flag
app.use((req,res,next) => {
    res.locals.login = req.session.login;
    res.locals.csrfToken = req.csrfToken();

    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    //check if user with ID exists
    app.listen(3000);
})
