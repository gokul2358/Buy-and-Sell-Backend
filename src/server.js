import Hapi from '@hapi/hapi';
import {handler} from "@hapi/hapi/lib/cors";
import routes from './routes';
import {db} from './database';
import admin from "firebase-admin";
import credentials from '../credentials.json';

admin.initializeApp({
    credential: admin.credential.cert(credentials),
});

let server;
const start = async () => {
    server = Hapi.Server({
        port: 8000,
        host: 'localhost',
    });

    routes.forEach(route => server.route(route));
    db.connect();
    await server.start();
    console.log(`server is listening on ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

 process.on ('SIGINT', async () => {
    console.log('Stopping Server....');
    await server.stop({timeout: 10000});
    db.end();
    console.log('Server Stopped');
    process.exit(0);
});

start();
