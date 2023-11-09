import http from "http";
import express, { Application, Request, Response } from 'express';
import { createHttpTerminator } from 'http-terminator';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import "./process";
import "dotenv/config"
import { env } from "./config";
import routes from "./routes";
const mongoose = require("mongoose");
import { logger } from "./config";
import { AddressInfo } from 'net';
import Role from "./models/auth/Role";

const PORT = env.PORT || 3000;

// import checkPermissions from "./middlewares/checkPermissions";

dotenv.config();

export const app: Application = express();

export const server = http.createServer(app);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(checkPermissions);

app.get('/', (req: Request, res: Response) => {
    res.send(
        `${env.environment === 'production'
            ? 'Welcome to MCICS FPI production environment'
            : 'Welcome to MCICS FPI development environment'
        }`
    );
});

app.use('/mcics/api/v1', routes);

app.all('/*', (req: Request, res: Response, next) => {
    next(new Error('Resource unavailable'));
});

app.use((err: any, req: Request, res: Response) => {
    res.status(400).send({
        success: false,
        message: err.message.toLowerCase().includes('duplicate key')
            ? 'Account already exists'
            : err.message,
    });
});

export const httpTerminator = createHttpTerminator({
    server,
});

mongoose
    .connect(env.DATABASE_URI)
    .then(() => {
        const server: any = app.listen(PORT, () => {
            const { port, address } = server.address() as AddressInfo;
            initialize();
            logger("start application", `Server is running on http://${address}${port}`);
        });
    })
    .catch((err: Error) => {
        console.log(err);
        process.exit(1);
    });

function initialize() {
    Role.estimatedDocumentCount({})
        .then((count: number) => {
            // Use the count
            if (count <= 1) {
                new Role({
                    name: "user",
                }).save();

                new Role({
                    name: "moderator",
                }).save();

                new Role({
                    name: "admin",
                }).save();
            }
        })
        .catch((err: Error) => {
            // Handle the error
            throw new Error(err.message);
        });
}



