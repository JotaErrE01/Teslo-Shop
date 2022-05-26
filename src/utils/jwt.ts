import { sign, verify } from 'jsonwebtoken';
import { jwt } from '.';

export const signToken = (payload: { _id: string, email: string }) => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('JWT_SECRET_SEED is not defined');
  }

  return sign(payload, process.env.JWT_SECRET_SEED, { expiresIn: '1h' });
}

export const isValidToken = (token: string): Promise<string> => {
  if (!process.env.JWT_SECRET_SEED) {
    throw new Error('JWT_SECRET_SEED is not defined');
  }

  return new Promise((resolve, reject) => {
    try {
      verify(token, process.env.JWT_SECRET_SEED!, (err, payload) => {
        if (err) return reject(err);
        const { _id } = payload as { _id: string };
        return resolve(_id);
      });
    } catch (error) {
      console.log(error);
      reject('JWT no valido');
    }
  })
}
