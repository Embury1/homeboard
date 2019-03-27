import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import script1 from './1-move-device-name';
import script2 from './2-products-view';

dotenv.config();

const scripts = [
    script1,
    script2
];

MongoClient.connect(process.env.DB_URL, (err, client) => {
    if (err) return console.error(err);
    const db = client.db('homeboard');
    Promise.all(scripts.map((script) => script(db))).then(() => {
        client.close();
        console.log('Finished migrating.');
    });
});
