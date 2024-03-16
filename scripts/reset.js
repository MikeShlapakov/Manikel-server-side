const mongoose = require('mongoose');
const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');

(async () => {
    // connect to database
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Successfully connected to MongoDB at ${process.env.MONGO_URL}`);

    await mongoose.connection.db.dropDatabase();
    console.log(`Database bombed`);

    console.log(`Disconnecting from MongoDB...`)
    await connection.disconnect();
})();
