const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let db;
const mongoConnect = (cb) =>{
    MongoClient.connect('mongodb+srv://jon:qur7hnt7ySG6Skrn@cluster0.z1rdx.mongodb.net/Gallery?retryWrites=true&w=majority').then(client => {
        console.log('Connected!')

        //stored connection to the database
        db = client.db();
        cb();
    }).catch(e=>{
        console.log(e);
        throw e;
    });
};

const getDB = () => {
    if (db) {
        return db;
    }
    throw 'No DB found!';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;