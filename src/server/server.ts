"use strict"

// import necessary module and types

import express, { Request, Response } from "express";
import path from 'path';
import {fileURLToPath} from 'url';

import eventRoutes from "./eventRoutes.js";
// convert to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initialize express app
const app = express();
const port = process.env.PORT || 3000;


async function startServer() {
    try{
        app.listen(port, () => {
            console.log(`[INFO] Server started on http://localhost:${port}`);
        });
    }catch (error){
        console.error("[ERROR] failed to start server");
        process.exit(1);
    }
}



// Middleware to parse incoming json payloads
app.use(express.json());

//server static file (HTML , CSS ,JS etc...)  from the project root
app.use(express.static(path.join(__dirname, '../..')));

// server static assets from node_modules for client-side user and rendering
app.use('/node_modules/@fortawesome/fontawesome-free',
    express.static(path.join(__dirname, '../../node_modules/@fortawesome/fontawesome-free')));
app.use('/node_modules/bootstrap',
    express.static(path.join(__dirname, '../../node_modules/bootstrap')));

// mount the contact routes within Node
// delegate all/api/contact/* requests to it
app.use('/api/events', eventRoutes);


// Routing
// route to server the home page (index.html)
app.get('/',(req: Request, res: Response) => {
   res.sendFile(path.join(__dirname, "../../","index.html"));
});


await startServer();