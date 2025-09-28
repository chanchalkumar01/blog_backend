const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const connectDB = require('./config/db');
const User = require('./api/v1/models/user.model');

async function main() {
    await connectDB();

    try {
        // Generate fictional user data
        const userCount = 5;
        const users = Array.from({ length: userCount }, () => {
            const username = faker.internet.userName();
            const email = faker.internet.email();
            const password = faker.internet.password();

            return { username, email, password };
        });

        // Insert the user documents into the collection.
        console.log('Inserting documents into the collection...');
        const result = await User.insertMany(users);
        console.log(`Inserted ${result.length} documents into the collection.`);

        // Query the collection for the first fictional user
        const email = users[0].email;
        const query = { email };
        const document = await User.findOne(query);

        console.log(`Document with email '${email}':`);
        console.log(document);
    } catch(error) {
        console.log(error);
    } finally {
        mongoose.connection.close();
    }
}

main().catch(console.error);
