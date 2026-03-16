import { DefaultApi } from "@/openapi/api";
import { Configuration } from "@/openapi/configuration";

export const createApiClient = () => {
  const basePath = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!basePath) {
    throw new Error("NEXT_PUBLIC_APIBASE_URL is not set");
  }

  return new DefaultApi(
    new Configuration({
      basePath,
    }),
  );
};
