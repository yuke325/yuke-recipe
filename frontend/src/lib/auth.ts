import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";

const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN!;

// 共通のGoogleのログイン設定、サインイン許可条件、JWT/sessionの中身を定義
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      const googleProfile = profile as { email?: string; email_verified?: boolean };
      const email = googleProfile?.email ?? "";
      return (
        googleProfile?.email_verified === true &&
        email.endsWith(`@${ALLOWED_DOMAIN}`)
      );
    },
    // Googleから返されたid_tokenをJWTとsessionに含める
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.googleIdToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.googleIdToken = token.googleIdToken as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
};

type GetServerSidePropsContextOrApi =
  | GetServerSidePropsContext
  | [NextApiRequest, NextApiResponse];

// 未ログインならリダイレクト、ログイン済みならセッションを返す
export async function requireAuth(context: GetServerSidePropsContextOrApi) {
  // Next.jsから渡されるcontextがGetServerSidePropsContextと
  // APIルート[req, res]どちらでも対応できるように形を揃える
  const args = Array.isArray(context)
    ? context
    : ([context.req, context.res] as [NextApiRequest, NextApiResponse]);

  const session = await getServerSession(...args, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return { props: { session } };
}
