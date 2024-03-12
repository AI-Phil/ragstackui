'use server'
export async function getRAGStackApiEndpoint(): Promise<string> {
    return process.env.RAGSTACK_API_ENDPOINT || "http://fastapi:80";
  }
  