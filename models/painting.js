const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

module.exports = class Painting {
    constructor(imagePath, title, size, description, id, userId) {
        this.imagePath = imagePath;
        this.title = title;
        this.size = size;
        this.description = description;
        this._id = id;
        this.userId = userId;
    }

    
    save() {
        const db = getDB();
        let operation;

        console.log("What is the ID? ", this._id);
        if (this._id) {
            //update product
            //this._id was made into an object id previously
            operation = db.collection('paintings').updateOne({_id: this._id}, {$set: this});
        } else {
            //insert it
            operation = db.collection('paintings').insertOne(this);
        }
        //connect to mongoDB and save painting
        return operation.then(result => {
            console.log(result);
        }).catch(e => {
            console.log(e);
        });
    }

    static find(userId) {

        const db = getDB();

        return db
        .collection('paintings')
        .find({userId: mongodb.ObjectId(userId)})
        .toArray()
        .then(paintings => {
            console.log("DO I RECIEVE THE PAINTING", paintings);

            return paintings;
        })
        .catch(e => {
            console.log(e);
        })
    }
    static fetchAll() {

        const db = getDB();
        return db
        .collection('paintings')
        .find()
        .toArray()
        .then(paintings => {
            console.log(paintings)

            return paintings;
        })
        .catch(e => {
            console.log(e);
        });
    }

    //use the mongodb object because the ID is an ObjectID (not native to JS)
    static findById(paintId) {
        console.log(paintId);
        const db = getDB();
        return db.collection('paintings')
        .find({_id: new mongodb.ObjectId(paintId)})
        .next()
        .then(painting => {
            console.log(painting);

            //we must return the painting because we are using .then()
            return painting;
        })
        .catch(e => {
            console.log(e);
        })

    }

    static deleteById(paintId) {
        const db = getDB();

        //also need to remove this painting from everyones bag
        return db.collection('paintings').deleteOne({_id: new mongodb.ObjectId(paintId)})
        .then(result => {
            console.log(result);
        })
        .catch(e => {
            console.log(e);
        })

    }

    static removeFromBags(paintId) {
        const db = getDB();

        //remove this painting from all user carts

        return db.collection('users').update(
            {},
            {$pull: {bag :{ paintingId: new mongodb.ObjectId(paintId)}}},
            {multi: true}
        ).then(result => {
            console.log(result);
        })
        .catch(e => {
            console.log(e);
        })
    }
}