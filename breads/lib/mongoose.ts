import mongoose from 'mongoose'

let isConnected = false;

export const connectToDb = async () => {
    mongoose.set("strictQuery", true);
    if (!process.env.MONGODB_URI) {
        console.log('MONGODB_URL not found');
        return
    }

    if (isConnected) {
        console.log('Already connected to MONGODB')
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        isConnected = true;

        console.log("connected to MongoDb")
    } catch (error) {
        console.log(error)
        throw new Error("Failed to connect to MongoDB");
    }
}