'use server'
import { getFastApiEndpoint } from '../settings/config.server';

export async function getTestCQL() {
    const fastApiEndpoint = await getFastApiEndpoint();
    const response = await fetch(`${fastApiEndpoint}/test-cql`);
    const data = await response.json();
    return data;
  }
  