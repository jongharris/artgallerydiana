const Painting = require('../models/painting');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req,res,next) => {

    res.render('admin/add-product', {
        pageTitle: "Add Paintings",
        edit: "false",
        paint: ""
    });
};

exports.getAdminPaintings = (req, res, next) => {
    Painting.fetchAll().then(paintings => {
    // Painting.find(req.user._id).then(paintings => {
        res.render('admin/paintings', {
            paints: paintings,
            pageTitle: 'Gallery',
            path: '/',
            hasPaintings: paintings.length > 0,
            login: req.session.login
        })
    })
};

exports.getEditPainting= (req,res,next) => {

    //query params are strings
    const editFlag = req.query.edit;

    if (editFlag != "true") {
        return res.redirect('/');
    }

    //find the paintings
    Painting.findById(req.params.ID).then(painting => {
        res.render('admin/add-product', {
            pageTitle: 'Edit Painting',
            edit: editFlag,
            paint: painting,
            login: req.session.login
        })
    })
}
    

exports.postAddProduct = (req,res,next) => {

    //create the product

    const imageFile = req.file;

    console.log(imageFile);

    const imagePath = imageFile.path;

    console.log(imagePath);

    const painting = new Painting(imagePath, req.body.title, req.body.size, req.body.description, null, req.user._id);

    painting.save().then(result => {
        console.log('Painting Created')
        res.redirect('/admin/paintings');
    }).catch(e => {
        console.log(e);
    })

};

exports.postEditProduct = (req,res,next) => {

    const painting = new Painting(req.body.title, req.body.size, req.body.description, new ObjectId(req.body.id));

    if(painting.userId !== req.user._id){
        return res.redirect('/');
    }

    painting.save().then(result => {
        res.redirect("/admin/paintings");
    }).catch(e => {
        console.log(e);
    })
  
}


exports.postDeleteProduct = (req,res,next) => {

    const paintingID = req.body.id;
    
    Painting.findById(paintingID).then(painting => {

        if (painting.userId.toString() != req.user._id.toString()) {
            return res.redirect('/');

        }
        Painting.deleteById(painting._id)
        .then(() => {        
            console.log("DO I GET HERE");
            Painting.removeFromBags(paintingID)
            .then((result) => {
                console.log(result);
                return res.redirect('/admin/paintings');
            })
            .catch(e => {
                console.log(e);
            })
        })
    })
}