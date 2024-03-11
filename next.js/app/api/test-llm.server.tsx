'use server'
import { getFastApiEndpoint } from '../settings/config.server';

export async function getTestLLM() {
    const fastApiEndpoint = await getFastApiEndpoint();
    const response = await fetch(`${fastApiEndpoint}/test-llm?city=Dublin`);
    const data = await response.json();
    return data;
  }
  