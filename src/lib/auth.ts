import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// PrismaAdapter import removed
// Prisma client import removed
import { comparePassword } from './hash';
import { supabaseClient } from './supabaseClient';

export const authOptions: NextAuthOptions = {
  // adapter removed; using Supabase directly,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { data: user, error } = await supabaseClient
          .from('admin_user')
          .select('id, email, name, password, role')
          .eq('email', credentials.email)
          .single();
        if (user && (await comparePassword(credentials.password, user.password))) {
          return { id: String(user.id), name: user.name ?? '', email: user.email, role: user.role } as any;
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/admin/signin' },
};

export default NextAuth(authOptions);
