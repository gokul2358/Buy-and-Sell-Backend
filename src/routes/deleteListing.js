import {db} from '../database';
import * as admin from "firebase-admin";
export const deleteListingRoute = {
    method: 'DELETE',
    path: '/api/listings/{id}',
    handler: async (req,h) => {
        const id = req.params.id;
        const token = req.headers.authtoken;
        const user = await admin.auth().verifyIdToken(token);
        const userId = user.uid;
        await db.query(`
        DELETE from listings where id=? AND userId=?`,
            [id,userId],);
        return {message: 'Success!'};
    }
}
