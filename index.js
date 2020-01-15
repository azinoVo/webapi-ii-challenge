const express = require('express');
const router = require('./data/routes/router');
const server = express();
server.use(express.json());


server.use('/api/posts', router);

server.use('/', (req, res) => res.send('API up and running!'));

server.listen(9000, () => console.log('API running on port 9000'));