// import mongoose from "mongoose";

// //function to connet to the MongoDB database

// const connectDB = async () => {

//     mongoose.connection.on("connected", () => console.log("database connected"));
    
// await mongoose.connect(`${process.env.MONGODB_URI}/job-portal` )

// }
 
// export default connectDB;


import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`);
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// This is the line you are likely missing:
export default connectDB;