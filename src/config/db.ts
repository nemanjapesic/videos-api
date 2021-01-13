import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI: any = process.env.MONGO_URI; // This gave me headache, it just refuses to work without setting it to any

const connectDB = async () => {
    try {
        console.log("Connection url =>", MONGO_URI);

        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
