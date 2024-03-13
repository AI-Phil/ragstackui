'use client';

import { useState } from 'react';
import Menu from '../components/Menu';
import { RAGStackApiResponse } from '../../types/RAGStack/ragstack';
import { TestCQLData, CqlDB } from '../../types/RAGStack/test-cql';

type TabName = 'cql' | 'llm';

export default function TestSetup() {
    const [activeTab, setActiveTab] = useState<TabName | ''>('');
    const [cqlData, setCqlData] = useState<RAGStackApiResponse<TestCQLData[]>>();
    const [llmData, setLLMData] = useState<RAGStackApiResponse<string>>();
    const [loading, setLoading] = useState(false);
    const [database, setDatabase] = useState<CqlDB>('dse');

    const runCQLQuery = async () => {
        setLoading(true);
        setCqlData(undefined);
        try {
            const response = await fetch(`/api/RAGStack/test-cql?db=${database}`);
            if (!response.ok) throw new Error('Failed to fetch CQL data');
            const data: RAGStackApiResponse<TestCQLData[]> = await response.json();
            setCqlData(data);
        } catch (error) {
            console.error("Error fetching CQL data:", error);
        } finally {
            setLoading(false);
        }
    };

    const runLLMQuery = async () => {
        setLoading(true);
        setLLMData(undefined);
        try {
            const response = await fetch(`/api/RAGStack/test-llm?city=Dublin`);
            if (!response.ok) throw new Error('Failed to fetch LLM data');
            const textData = await response.text();
            const data: RAGStackApiResponse<string> = { data: textData };
            setLLMData(data);
        } catch (error) {
            console.error("Error fetching LLM data:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Menu />
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
                            {JSON.stringify(cqlData.data, null, 2)}
                        </div>
                    )}
                </div>
            )}
            {activeTab === 'llm' && (
                <div className="p-4">
                    <button
                        className="bg-blue-500 text-white p-2 rounded mb-4"
                        onClick={runLLMQuery}
                    >
                        Run LLM
                    </button>
                    {loading && <p>Calling for data...</p>}
                    {llmData && (
                        <div className="whitespace-pre-wrap bg-white p-4 border rounded shadow">
                            {llmData.data}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
