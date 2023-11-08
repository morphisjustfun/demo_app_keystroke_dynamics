import {NextApiRequest, NextApiResponse} from "next";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({token: undefined, message: 'Method not allowed', success: false});
        return;
    }

    const {username, password, hash} = JSON.parse(req.body);

    // TODO validate hash
    //

    if (username === 'admin' && password === 'admin') {
        res.status(200).json({token: '1234', message: 'Login success', success: true});
    } else {
        res.status(401).json({token: undefined, message: 'Invalid credentials', success: false});
    }

    // const user = await getUser({ username, password });
    // if (!user) {
    //   res.status(401).json({ message: 'Invalid credentials' });
    //   return;
    // }
    // const token = await createToken(user);
    // res.status(200).json({ token });
}