import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import * as uuid from 'uuid';
import session from 'express-session';
import memcached from 'connect-memcached';
import cookieParser from 'cookie-parser';
import router from './routes/index';

const app = express();

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 3001;
const MEMCACHED_PORT = process.env.MEMCACHED_PORT || 11211;
const MEMCACHED_HOST = process.env.MEMCACHED_HOST || '127.0.0.1';

const MemcachedStore = memcached(session);

declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: string }
    }
};

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(cookieParser());

app.use(session({
    genid: (request: express.Request) => {
        console.log('Inside the session middleware');
        console.log(request.sessionID);
        return uuid.v4().toString();
    },
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    store: new MemcachedStore({
        hosts: [`${MEMCACHED_HOST}:${MEMCACHED_PORT}`],
        secret: process.env.MEMCACHED_SECRET
    })
}));

app.use(router);

app.listen(SERVER_PORT, () => console.log(`Server is listening on port ${SERVER_PORT}`));