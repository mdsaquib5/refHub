import mongoose from "mongoose";

const connectDb = async () => {
    mongoose.connection.on('connected', () => {
        console.log('MonogDb Connected');
    });

    await mongoose.connect(`${process.env.MONGO_URI}/referralHub`);
}

export default connectDb;