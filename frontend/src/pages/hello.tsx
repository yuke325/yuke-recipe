import type { GetServerSideProps } from "next";
import { Configuration, DefaultApi, type GetHello200Response } from "@/openapi";

type HelloPageProps = GetHello200Response;

export const getServerSideProps: GetServerSideProps<
  HelloPageProps
> = async () => {
  const api = new DefaultApi(
    new Configuration({
      basePath: process.env.RAILS_API_BASE_URL ?? "http://localhost:3000",
    }),
  );

  const { data } = await api.getHello();

  return { props: data };
};

export default function HelloPage({ message }: HelloPageProps) {
  return <h1>{message}</h1>;
}
