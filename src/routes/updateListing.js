import {db} from '../database';
import * as admin from 'firebase-admin';

export const updateListingRoute = {
    method: 'POST',
    path: '/api/listings/{id}',
    handler: async (req,h) => {
        const id = req.params.id;
        const {name, description, price} = req.payload;
        const token = req.headers.authtoken;
        const user = await admin.auth().verifyIdToken(token);
        const userId = user.uid;
        await db.query(`
            UPDATE listings 
                SET name = ?, description = ?, price = ?
                WHERE id=? AND userId=?
        `,
            [name, description, price, id, userId],
            );
        const {results} = await db.query(
            'SELECT * FROM listings WHERE id=? AND userId=?',
            [id, userId],
        );
        return results[0];
    }
}
