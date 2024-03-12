'use server'
import { getRAGStackApiEndpoint as getRAGStackApiEndpoint } from '../settings/config.server';
import { RAGStackApiResponse } from './ragstack-api.interfaces';

export interface TestCQLData {
  foo: number;
  bar: string;
}

export async function getTestCQL(): Promise<RAGStackApiResponse<TestCQLData[]>> {
    const fastApiEndpoint = await getRAGStackApiEndpoint();
    const response = await fetch(`${fastApiEndpoint}/test-cql`);
    const data = await response.json();
    return data;
  }
  