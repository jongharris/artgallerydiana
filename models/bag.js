const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'bag.json'
)

module.exports = class Bag {
    static addPainting(id) {
        //fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let bag = {paintings: []};
            //read from file if nothing is there
            if (!err) {
                bag = JSON.parse(fileContent);
            }
        

        //find existing painting in cart
        const existingPainting = bag.paintings.find(p => p.ID === id);

        let newPainting;

        if (!existingPainting) {
            newPainting = {ID: id}
            bag.paintings = [newPainting,...bag.paintings];
        } 
        console.log("The add happens first")

        fs.writeFile(p, JSON.stringify(bag), (e) => {
            console.log(e);
        })
    });
       
    }

    static deletePainting(id) {

        //get the bag
        fs.readFile(p, (err, fileContent) => {
            //no bag found
            if(err) {
                return;
            }

            const updatedBag = JSON.parse(fileContent);
            updatedBag.paintings = updatedBag.paintings.filter(p => p.ID != id);

            console.log(updatedBag);
            fs.writeFile(p, JSON.stringify(updatedBag), (e) => {
                console.log(e);
            });
        });
    }

    static getBag(cb) {
        //the CB will be the render

        fs.readFile(p,(err,fileContent) => {
            //no bag found
            if(err) {
                console.log("File not found");
                cb({paintings:[]});
            } else {
                const bag = JSON.parse(fileContent);
                cb(bag);
            }

            
        })
    }
}