'use client';

import { useState } from 'react';
import { ApiErrorResponse } from '../../types/RAGStack/ragstack';
import { TestCQLData, CqlDB } from '../../types/RAGStack/test-cql';

type TabName = 'cql' | 'llm';

export default function TestSetup() {
    const [activeTab, setActiveTab] = useState<TabName | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [database, setDatabase] = useState<CqlDB>('dse');
    const [cqlData, setCqlData] = useState<TestCQLData[] | null>(null);
    const [city, setCity] = useState<string>('Dublin'); 
    const [llmData, setLLMData] = useState<string | null>(null);

    const runCQLQuery = async () => {
        setLoading(true);
        setError(null);
        setCqlData(null);
        try {
            const response = await fetch(`/api/RAGStack/test-cql?db=${database}`);
            if (!response.ok) {
                const errResponse: ApiErrorResponse = await response.json();
                throw new Error(errResponse.detail);
            }
            const data: TestCQLData[] = await response.json();
            setCqlData(data);
        } catch (err) {
            // TypeScript sees 'err' as unknown, so we need to assert the type if we want to read 'message'
            setError((err as Error).message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const runLLMQuery = async () => {
        setLLMData(null);
        setLoading(true);
        setError(null);
        let partialData = ''; // This will accumulate chunks of data as they arrive
    
        try {
            const response = await fetch(`/api/RAGStack/test-llm?city=${city}`);
            if (!response.ok) {
                const errResponse: ApiErrorResponse = await response.json();
                throw new Error(errResponse.detail);
            }
    
            // Check if response.body is not null before proceeding
            if (response.body) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder(); // Used to decode the stream's chunks into text
    
                // Read through the stream chunk by chunk
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break; // The stream has been fully read
                    
                    partialData += decoder.decode(value, { stream: true }); // Decode chunk and append it
                    setLLMData(partialData); // Update state with the accumulated content
                }
                // Optionally, handle the final data processing or state update here
            } else {
                // Handle the case where response.body is null
                throw new Error("No response body");
            }
        } catch (err) {
            setError((err as Error).message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <div>
            <div className="text-center p-4">
                <h1 className="text-4xl font-bold">Test Setup Page</h1>
            </div>
            <div className="flex justify-center p-4 border-b-2">
                <button
                    className={`mr-4 py-2 px-4 ${activeTab === 'cql' ? 'text-blue-500 border-blue-500 border-b-2' : 'text-gray-500 border-transparent border-b-2'}`}
                    onClick={() => setActiveTab('cql')}
                >
                    Test CQL
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'llm' ? 'text-blue-500 border-blue-500 border-b-2' : 'text-gray-500 border-transparent border-b-2'}`}
                    onClick={() => setActiveTab('llm')}
                >
                    Test LLM
                </button>
            </div>
            {activeTab === 'cql' && (
                <div className="p-4 flex justify-center items-center flex-col">
                    {/* Radio buttons and Run CQL button together */}
                    <div className="flex justify-center items-center mb-4">
                        <label className="flex items-center mr-4">
                            <input
                                type="radio"
                                name="database"
                                value="astra"
                                checked={database === 'astra'}
                                onChange={(e) => setDatabase(e.target.value as CqlDB)}
                            />
                            <span className="ml-2">Astra</span>
                        </label>
                        <label className="flex items-center mr-4">
                            <input
                                type="radio"
                                name="database"
                                value="dse"
                                checked={database === 'dse'}
                                onChange={(e) => setDatabase(e.target.value as CqlDB)}
                            />
                            <span className="ml-2">DSE</span>
                        </label>
                        <button
                            className="bg-blue-500 text-white p-2 rounded"
                            onClick={runCQLQuery}
                        >
                            Run CQL
                        </button>
                    </div>
                    {loading && <p>Calling for data...</p>}
                    {cqlData && (
                        <div className="whitespace-pre-wrap bg-white p-4 border rounded shadow mt-4">
                            {JSON.stringify(cqlData, null, 2)}
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'llm' && (
                <div className="p-4">
                    <div className="flex justify-center items-center mb-4">
                        {/* Text input for specifying the city */}
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="mr-4 p-2 border rounded"
                            placeholder="Enter city"
                        />
                        <button
                            className="bg-blue-500 text-white p-2 rounded"
                            onClick={runLLMQuery}
                        >
                            Run LLM
                        </button>
                    </div>
                    {loading && !llmData && <p>Calling for data...</p>}
                    {llmData && (
                        <div className="whitespace-pre-wrap bg-white p-4 border rounded shadow">
                            {llmData}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
