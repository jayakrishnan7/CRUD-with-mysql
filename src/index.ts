import express from 'express';
import connects  from './server/config/db';
import { router } from './server/routes/routes';

const path = require('path')

// cross origin resource sharing............
const cors = require('cors');

// morgan for logs............
const morgan = require('morgan');

const app = express();

const PORT = 4001; 

// db connection.............
connects();

//parse json bodies...........
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('tiny'));

//cors........................
app.use(cors({
    origin: ['http://localhost:4200'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


//make files as static........
app.use('/files', express.static(path.join(__dirname, "./public/assets/files")));


// route ......................
app.use('/', router);


// server connection
app.listen(PORT, (): void => {
    console.log(`Server is running on ${PORT}`);
    
})