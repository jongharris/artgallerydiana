const Painting = require('../models/painting')
const Bag = require('../models/bag');

exports.getProducts = (req, res, next) => {
    
    //fetch all the paintings
    let role = null;

    if(req.user != null){
        role = req.user.role;
    }
    
    Painting.fetchAll().then(paintings => {
        res.render('shop/shop', {
            paints: paintings,
            pageTitle: 'Gallery',
            path: '/',
            hasPaintings: paintings.length > 0,
            login: req.session.login,
            role
        })
    })
}

exports.postBag = (req, res, next) => {
    //add this painting to the bag
    const paintingId = req.body.id;

    Painting.findById(paintingId).then(painting => {
        return req.user.addToBag(painting);
    })

    res.redirect('/');
}

exports.getBag = (req,res,next) => {

    //display the paintings in the users saved bag
    req.user.getBag(req.user._id).then(bag => {
        //bag contains all the painting ID's
        const paintings = [];

        //loop over the bag
        for (let i = 0; i < bag[0].bag.length; i++) {
            paintings.push(Painting.findById(bag[0].bag[i].paintingId));
        }

        //wait for all promises
        Promise.all(paintings).then((paintingList) => {
            res.render('shop/bag', {
                pageTitle: "Saved Paintings",
                paints: paintingList,
                login: req.session.login
            })
        })
        
    }).catch(e => {
        console.log(e);
    })
}

exports.deleteFromBag = (req, res, next) => {
    //get the id of the painting to be revomed
    const paintId = req.body.id;
    

    //get the user's saved bag
    req.user.getBag(req.user._id).then(bag => {

        req.user.removeFromBag(paintId, bag[0].bag).then((result) => {
            console.log(result);
            res.redirect('/bag');
        })
        .catch (e => {
            console.log(e);
        });
    })
}

exports.getInquiry = (req, res, next) => {

    const paintId = req.params.paintingID;
    Painting.findById(paintId).then(painting => {
        res.render('shop/inquire', {
           pageTitle: "Painting Inquiry",
           painting: painting,
           login: req.session.login
        });
    })

}