const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/my-blog';
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db();
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
        process.exit(1);
    }
}

module.exports = connectDB;