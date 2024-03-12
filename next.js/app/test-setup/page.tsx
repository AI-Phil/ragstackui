'use client';

import { useState } from 'react';
import Menu from '../components/Menu';
import { RAGStackApiResponse } from '../api/ragstack-api.interfaces';
import { getTestCQL, TestCQLData } from '../api/test-cql.server';
import { getTestLLM } from '../api/test-llm.server';

type TabName = 'cql' | 'llm';

export default function TestSetup() {
    const [activeTab, setActiveTab] = useState('');
    const [cqlData, setCqlData] = useState<RAGStackApiResponse<TestCQLData[]>>();
    const [llmData, setLLMData] = useState<RAGStackApiResponse<string>>();
    const [loading, setLoading] = useState(false);

    const fetchData = async (tab: TabName) => {
        if (tab === 'cql' && cqlData === undefined) {
            setLoading(true);
            const data = await getTestCQL();
            setCqlData(data);
            setLoading(false);
        } else if (tab === 'llm' && llmData === undefined) {
            setLoading(true);
            const data = await getTestLLM();
            setLLMData(data);
            setLoading(false);
        }
    };

    const handleTabChange = async (tab: TabName) => {
        if (activeTab !== tab) {
            setActiveTab(tab); // Set the active tab
            setCqlData(undefined); // Reset CQL data state
            setLLMData(undefined); // Reset LLM data state
            await fetchData(tab); // Fetch data for the new tab
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
                    onClick={() => handleTabChange('cql')}
                >
                    Test CQL
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'llm' ? 'text-blue-500 border-blue-500 border-b-2' : 'text-gray-500 border-transparent border-b-2'}`}
                    onClick={() => handleTabChange('llm')}
                >
                    Test LLM
                </button>
            </div>
            <div className="p-4">
                {loading && <p>Calling for data...</p>}
                {!loading && activeTab === 'cql' && cqlData && (
                    <div className="whitespace-pre-wrap bg-white p-4 border rounded shadow">
                        {JSON.stringify(cqlData.data, null, 2)}
                    </div>
                )}
                {!loading && activeTab === 'llm' && llmData && (
                    <div className="whitespace-pre-wrap bg-white p-4 border rounded shadow">
                        {llmData.data}
                    </div>
                )}
            </div>
        </div>
    );
}
