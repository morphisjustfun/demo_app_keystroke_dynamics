import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import {CLIENT_ID, TWO_FACTOR_AUTHENTICATION_DOMAIN} from "@/config/constants";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({token: undefined, message: 'Method not allowed', success: false});
        return;
    }

    const {username, password, hash, characterTime} = req.body;

    const client = new PrismaClient();
    const matches = await client.tries.findMany({
        where: {
            hash: hash
        }
    });
    if (matches.length === 0) {
        res.status(401).json({token: undefined, message: 'Invalid credentials 2FA', success: false});
        return;
    } else {
        await client.tries.deleteMany({
            where: {
                hash: hash
            }
        });

        const users = await client.users.findMany({
            where: {
                username: username,
                password: password
            }
        });
        if (users.length === 0) {
            res.status(401).json({token: undefined, message: 'Invalid credentials User/Password', success: false});
            return;
        } else {
            await fetch(`${TWO_FACTOR_AUTHENTICATION_DOMAIN}/train`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    characterTime: characterTime,
                    'client_id': CLIENT_ID
                })
            });

            res.status(200).json({token: '1234', message: 'Login success', success: true});
            return;
        }
    }
}