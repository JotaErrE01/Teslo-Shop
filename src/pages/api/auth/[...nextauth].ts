import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'Tu Correo' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Tu Contraseña' },
      },
      async authorize( credentials ){
        try {
          // return { name: 'juan', correo: 'uncorreo@gmail.com', 'role': 'admin' };
          return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
        } catch (error) {
          return null;
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  //Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },

  session: {
    maxAge: 2592000, // 30 days
    strategy: 'jwt',
    updateAge: 86400, // 1 day
  },

  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {
      // console.log({ token, account, user });
      // saber si si logea con credenciales
      if(account) {
        token.accessToken = account.access_token;
      }      

      switch (account?.type) {
        case 'credentials':
          token.user = user;
          break;
        
        case 'oauth':
          token.user = await dbUsers.oAUTHToDbUser( user?.email || '' , user?.name || '' );
          break;

        default:
          break;
      }

      return token;
    },

    async session({ session, token, user }) {
      // console.log({ session, token, user });
      
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    }
  },
})
