import { sign } from 'jsonwebtoken';

export const signToken = ( payload: { _id: string, email: string } ) => {
  if(!process.env.JWT_SECRET_SEED) {
    throw new Error('JWT_SECRET_SEED is not defined');
  }

  return sign(payload, process.env.JWT_SECRET_SEED, { expiresIn: '1h' } );
}
