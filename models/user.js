const getDB = require('../util/database').getDB;
const mongodb = require ('mongodb')

class User {
    constructor(password, email, role, bag, id) {
        this.password = password;
        this.email = email;
        if (!bag) {
            this.bag = [];
        } else {
            this.bag = bag;
        }
    
        this._id = id;
        this.role = role;
    }

    save () {
        //get the DB connection
        const db = getDB();
        console.log("The new user is", this);
        return db.collection('users').insertOne(this);
    }

    addToBag(painting) {
        //check if the item is already in the bag

        //retrieve the existing bag
        const bagPainting = this.bag.find(p => p.paintingId.toString() == painting._id.toString());
        
        //check if the item already exists then we do not update

        if(!bagPainting) {
            //add a new painting to the bag
            console.log("Adding to the bag");
            const newBag = [...this.bag];
            newBag.push({paintingId: new mongodb.ObjectId(painting._id)})
            // const newBag = {paintings: [{paintingId: new mongodb.ObjectId(painting._id)}]};

            const db = getDB();
            return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, 
            {$set: {bag:newBag}})
            .then(result => {
                // console.log(result);
            })
            .catch(e => {
                console.log(e);
            });
        }
    }

    getBag(userId) {
        const db = getDB();

        return db.collection('users').find({_id: new mongodb.ObjectId(userId)}).project({bag: 1})
        .toArray()
        .then(bag => {
            return bag;
        })
        .catch(e => {
            console.log(e);
        })

        //return all painting array with id's
    }

    removeFromBag(paintingId, paintings) {
        const db = getDB();
     

            
           // filter the painting from the bag
           const updatedPaintings = paintings.filter(p => p.paintingId.toString() !== paintingId.toString());
            return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, {$set:{bag: updatedPaintings}})
            .then(result => {
                console.log(result);
            })
            .catch(e => {
                console.log(e);
            });
    }

    static findById(userId) {
        const db = getDB();

        return db.collection('users').find({_id: new mongodb.ObjectId(userId)}).next().then(user => {
            console.log(user);
            return user;
        })
        .catch(e => {
            console.log(e);
        });
    }

    static findOne(user) {
        const db = getDB();

        return db.collection('users').findOne({email: user.email}).then(user => {
            return user;
        })
        .catch(e => {
            console.log(e);
        })
    }
}

module.exports = User;