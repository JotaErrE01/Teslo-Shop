import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { compareSync } from 'bcryptjs';
import { jwt } from '../../../utils';

type Data = 
  | { message: string; }
  | { user: { email: string; name: string; role: string; }; token: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return validateJWT(req, res);
  
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

async function validateJWT(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { token = '' } = req.cookies;
  let userId;

  try{
    userId = await jwt.isValidToken(token);
  }catch (error){
    console.log(error);
    return res.status(401).json({ message: 'Token no valido' });
  }

  await db.connect();
  const user = await User.findById(userId);

  await db.disconnect();

  if (!user) return res.status(400).json({ message: 'Usuario no Encontrado' });

  const { name, email, role } = user;

  return res.status(200).json({
    token: jwt.signToken({ _id: user._id, email }),
    user: { email, role, name }
  });
}
