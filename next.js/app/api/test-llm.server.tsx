'use server'
import { getRAGStackApiEndpoint } from '../settings/config.server';
import { RAGStackApiResponse } from './ragstack-api.interfaces';

export async function getTestLLM(): Promise<RAGStackApiResponse<string>> {
    const ragstackApiEndpoint = await getRAGStackApiEndpoint();
    const response = await fetch(`${ragstackApiEndpoint}/test-llm?city=Dublin`);
    const data = await response.json();
    return data;
  }
  