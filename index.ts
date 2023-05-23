import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import kategooriacontroller from "./controllers/kategooriacontroller";
import toodecontroller from "./controllers/toodecontroller";
import aadresscontroller from "./controllers/aadresscontroller";
import maksestaatusController from "./Controllers/maksestaatusController";
import kontaktAndmedController from "./Controllers/kontaktAndmedController";


const bodyParser = require('body-parser');
const app: Express = express();

mongoose.connect("mongodb+srv://robinnoormets:ZdVTS7Mulz65qEVu@cluster0.kpte1ay.mongodb.net/");
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', toodecontroller);
app.use('/', kategooriacontroller);
app.use('/', aadresscontroller);
app.use('/', maksestaatusController);
app.use('/', kontaktAndmedController);

app.listen(3000,() => {
    console.log(`[server]: Server is running at http://localhost:3000`);
});
