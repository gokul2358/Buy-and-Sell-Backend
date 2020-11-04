import * as admin from 'firebase-admin';
import {db} from "../database";
import * as Boom from "@hapi/boom";

export const getUserListingsRoute = {
    method: 'GET',
    path: '/api/users/{userId}/listings',
    handler: async (req,h) => {
        const token = req.headers.authtoken;
        //console.log(token);
        const user = await admin.auth().verifyIdToken(token);
        const userId = req.params.userId;
        if(user.uid !== userId) throw Boom.unauthorized('No Access to view others listings');

        const {results} = await db.query(
            'SELECT * FROM listings WHERE userId = ?',
            [userId],
        );
        return results;
    }
}
