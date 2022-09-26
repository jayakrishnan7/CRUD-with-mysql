import express, {Request, Response} from 'express';
import { router } from "./routes/routes";
import connects  from './config/db';

const app = express();

const PORT = 4001; 

// db connection
connects();

//parse json bodies...............
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// routes
app.use('/', router);

app.get('/test', (req: Request, res: Response) : void => {
    res.json({data: "test page"})
})


// server connection
app.listen(PORT, (): void => {
    console.log(`Server is running on ${PORT}`);
    
})