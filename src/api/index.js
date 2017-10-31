import express from 'express';

const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 8081;

if (env === 'production') {
    app.use(express.static('assets'));
}

app.get('/api/hello', (req, res) => {
    res.send('Hello from api!');
});

if (env === 'production') {
    app.get('/', (req, res) => {
        res.sendFile('assets/index.html');
    });
}

app.listen(port, () => {
    console.log(`Server listening at port ${port}`);
});