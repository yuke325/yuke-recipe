import type { GetServerSideProps } from "next";
import { requireAuth } from "@/lib/auth";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const result = await requireAuth(context);
  if ("redirect" in result) return result;
  return {
    redirect: {
      destination: "/recipes",
      permanent: false,
    },
  };
};

export default function Home() {
  return null;
}
