import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import kategooriacontroller from "./controllers/kategooriacontroller";

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

app.use('/', kategooriacontroller);

app.listen(3000,() => {
    console.log(`[server]: Server is running at http://localhost:3000`);
});