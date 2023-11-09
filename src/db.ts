const { MongoClient } = require("mongodb");

const main = async () => {
    const client = new MongoClient(process.env.DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        await client.connect();
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

export { main }
