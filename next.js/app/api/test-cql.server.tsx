'use server'
import { getRAGStackApiEndpoint } from '../settings/config.server';
import { RAGStackApiResponse } from './ragstack-api.interfaces';

export interface TestCQLData {
  data_center: string;
  schema_version: string;
}

export type CqlDB = 'dse' | 'astra';

export async function getTestCQL(cqlDB: CqlDB): Promise<RAGStackApiResponse<TestCQLData[]>> {
    const ragstackApiEndpoint = await getRAGStackApiEndpoint();
    const response = await fetch(`${ragstackApiEndpoint}/test-cql?db=${cqlDB}`);
    const data = await response.json();
    return data;
  }
  