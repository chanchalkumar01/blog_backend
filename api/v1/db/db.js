
const mongodb = require('mongodb');

const databaseConfiguration = {
    /**
     * Connection URI for the local MongoDB instance, running on the default port.
     * See https://www.mongodb.com/docs/v6.2/reference/connection-string/ for more details.
     */
    uri: 'mongodb://chanchalsloshout_db_user:ehCjmhF9SpgyicrX@ac-i1ltuvo-shard-00-00.g6bwg3a.mongodb.net:27017,ac-i1ltuvo-shard-00-01.g6bwg3a.mongodb.net:27017,ac-i1ltuvo-shard-00-02.g6bwg3a.mongodb.net:27017/?replicaSet=atlas-dsq7md-shard-0&ssl=true&authSource=admin',

    /**
     * Database and collection names. Replace with your own database and collection names.
     */
    databaseName: 'blogs',
}

/**
 * The MongoDB client instance to connect and interact with the database. 
 * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details.
 */
const client = new mongodb.MongoClient(databaseConfiguration.uri, {
    /**
     * Specify the Server API version for long-term API stability.
     * See https://www.mongodb.com/docs/manual/reference/stable-api/
     */
    serverApi: { version: '1' },
    tls: true,
    // tlsVersion: 'TLSv1.2'
});

async function connectToDatabase() {
    try {
        await client.connect();
        const db = client.db(databaseConfiguration.databaseName);
        console.log('Connected to MongoDB!');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = connectToDatabase;
