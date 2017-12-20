import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import script1 from './1-move-device-name';

dotenv.config();

const scripts = [
    script1
];

MongoClient.connect(process.env.DB_URL, (err, client) => {
    if (err) return console.error(err);
    const db = client.db('homeboard');
    scripts.forEach((script) => script(db));
    client.close();
    console.log('Finished migrating.');
});
