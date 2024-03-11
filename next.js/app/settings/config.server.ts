'use server'
export async function getFastApiEndpoint(): Promise<string> {
    return process.env.FASTAPI_ENDPOINT || "http://fastapi:80";
  }
  