import mongoose from 'mongoose';

const connectMangoDB = async()=>{
    mongoose.connect(process.env.MONGODB_URI!);
}

export default connectMangoDB;