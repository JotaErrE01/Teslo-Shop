

export interface IUser {
  _id      : string;
  name     : string;
  email    : string;
  password?: string;
  role     : 'admin'|'client';

  // timestamps of mongo
  createdAt: string;
  updatedAt: string;
};
