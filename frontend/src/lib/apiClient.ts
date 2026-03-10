import { DefaultApi } from "@/openapi/api";
import { Configuration } from "@/openapi/configuration";

export const createApiClient = () => {
  const basePath = process.env.API_BASE_URL;

  if (!basePath) {
    throw new Error("API_BASE_URL is not set");
  }

  return new DefaultApi(
    new Configuration({
      basePath,
    }),
  );
};
