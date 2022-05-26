import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { hashSync } from 'bcryptjs';
import { jwt, validations } from '../../../utils';

type Data = 
  | { message: string; }
  | { user: { email: string; name: string; role: string; }; token: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return registerUser(req, res);
  
    default:
      return res.status(400).json({ message: 'Bad Request' });
  }
}

async function registerUser(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { email = '', password = '', name = '' } = (req.body as { email: string, password: string, name: string });
  
  await db.connect();

  const user = await User.findOne({ email }).lean();

  if (user) {
    await db.disconnect();
    return res.status(400).json({ message: 'Ya existe un usuario registrado con ese email' });
  };

  // Validar Campos
  if(name.length < 2) {
    await db.disconnect();
    return res.status(400).json({ message: 'El nombre debe tener al menos 2 caracteres' });
  }

  if(password.length < 6) {
    await db.disconnect();
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  if(!validations.isValidEmail(email)){
    await db.disconnect();
    return res.status(400).json({ message: 'El correo no parece ser válido' });
  }

  const newUser = new User({ name, email: email.toLocaleLowerCase(), password: hashSync(password) });

  try {
    await newUser.save({ validateBeforeSave: true });
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({ message: 'Revisar los logs del servidor' });
  }

  const { _id, role } = newUser;

  const token = jwt.signToken({ _id, email });

  return res.status(200).json({
    token,
    user: { email, role, name }
  });
}
