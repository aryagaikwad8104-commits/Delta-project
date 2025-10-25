//index.js

const mongoose = require("mongoose");
const initData = require("C:\\Users\\aryag\\MAJORPROJECT\\init\\data.js"); 
const Listing = require("C:\\Users\\aryag\\MAJORPROJECT\\models\\listing.js");

//MONGO URL
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderLust';


main()
.then(() => {
    console.log("Connected to db ");
})
.catch((err) => {
    console.log(err);
});

// to connect with mongoose
async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initDB.data = initData.data.map((obj) => ({
        ...obj, 
        owner: ("68dec006e3c43433e5ad1a7f"),

     }));
    await Listing.insertMany(initDB.data);
    console.log("data was initialized");
};

initDB();