const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then( () => {
    console.log("connected to db");
})
.catch( (err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
   await Listing.deleteMany({});
  initdata.data =  initdata.data.map( (obj) => ({...obj, owner: "66b05e3ba6c6b084992b311e"}));
   await Listing.insertMany(initdata.data);
   console.log("data was initialized");
}
initDB();