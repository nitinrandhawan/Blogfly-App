import mongoose from "mongoose";

const DBConnection=async()=>{
    try {
      await  mongoose.connect(`${process.env.MONGODB_URI}/`)
            console.log('db is connected');
            console.log(mongoose.modelNames());

       
        } catch (error) {
            console.error('db connection error : ',error)
            process.exit(1)
        }
}


export default DBConnection
