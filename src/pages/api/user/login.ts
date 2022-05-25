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
    case 'POST':
      return loginUser(req, res);
  
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

async function loginUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = '', password = '' } = req.body;
  
  await db.connect();

  const user = await User.findOne({ email }).lean();

  await db.disconnect();

  if (!user) return res.status(400).json({ message: 'Usuario no Encontrado' });

  const isValid = compareSync( password, user.password! );

  if (!isValid) return res.status(400).json({ message: 'Contraseña Incorrecta' });

  const { name, role } = user;

  const token = jwt.signToken({ _id: user._id, email });

  return res.status(200).json({
    token,
    user: { email, role, name }
  });
}
