import { db } from '.';
import User from '../models/User';
import { compareSync } from 'bcryptjs';

export const checkUserEmailPassword = async ( email: string, password: string ) => {
  await db.connect();
  const user = await User.findOne({ email });
  await db.disconnect();

  if(!user) return null;

  if( !compareSync( password, user.password!  ) ) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    _id,
    email: email.toLocaleLowerCase(),
    role,
    name
  }
}


// Esta funcion crea o verifica el usuario de oauth
export const oAUTHToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect();
  const user = await User.findOne({ email: oAuthEmail });

  // si el usuario existe
  if(user) {
    await db.disconnect();
    const { _id, name, email, role } = user;
    return { _id, name, email, role };
  };

  // si el usuario no existe
  // pass con @ para evitar los match de bcrypt vid. 297 udemy
  const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });
  await newUser.save();
  await db.disconnect();
  
  const { _id, name, email, role } = newUser;
  return { _id, name, email, role };
}
