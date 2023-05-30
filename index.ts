import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import kategooriacontroller from "./controllers/kategooriacontroller";
import toodecontroller from "./controllers/toodecontroller";
import aadresscontroller from "./controllers/aadresscontroller";
import arveridacontroller from "./controllers/arveridacontroller";
import maksestaatusController from "./controllers/maksestaatusController";
import kontaktAndmedController from "./controllers/kontaktAndmedController";
import klientController from "./controllers/klientController";
import arveController from "./controllers/arvecontroller";
import path from "path";

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public'), { index: 'index.html' }));

app.use('/', toodecontroller);
app.use('/', kategooriacontroller);
app.use('/', aadresscontroller);
app.use('/', maksestaatusController);
app.use('/', arveridacontroller);
app.use('/', kontaktAndmedController);
app.use('/', klientController);
app.use('/', arveController);

app.listen(3000,() => {
    console.log(`[server]: Server is running at http://localhost:3000`);
});