import mongoose from "mongoose";

const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        dbName:"portfolio",
    }).then(()=>{
        console.log("connected to database");
    }).catch((error)=>{
        console.log(`something happend while connecting to the database : ${error}`);
    })
}

export default dbConnection;