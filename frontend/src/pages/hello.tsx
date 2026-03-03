import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import { Configuration, DefaultApi } from "@/openapi";

type Props = {
  message: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const config = new Configuration({ basePath: "http://localhost:3000" });
  const api = new DefaultApi(config);
  const response = await api.getHello();
  return {
    props: {
      message: response.data.message,
    },
  };
};

export default function HelloPage({
  message,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <p>{message}</p>;
}
